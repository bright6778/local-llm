# Java Card 本地 LLM Agent 方案

## 一、整体定位

做一个**离线、部署在服务器上**的本地 LLM agent，服务 Java Card 开发，覆盖三个领域：

- **applet**（Java）
- **COS**（C）
- **USIM**（规范 + 文件系统）

---

## 二、技术栈选型（已确定）

| 组件 | 选型 | 说明 |
|---|---|---|
| **推理模型** | DeepSeek-Coder-V2-Lite-Instruct | 16B MoE 代码模型，via Ollama 本地部署 |
| **Embedding 模型** | BAAI/bge-m3 | 多语言向量模型，sentence-transformers 直接加载，不走 Ollama |
| **向量库** | Chroma（本地文件） | 无需起服务，`data/vectordb/` 一个目录，瓶颈时可换 Qdrant |
| **后端框架** | FastAPI（Python） | OpenAI 兼容接口，将来换 vLLM 只改一行 `BASE_URL` |
| **推理服务** | Ollama | 前期单用户串行场景足够，并发高了再换 vLLM |

---

## 三、核心架构：一个模型，三套配置

不要起三个模型实例。正确做法是 **1 个基座模型服务 + 3 套（系统提示 + 知识库 + 工具）**，三个 agent 共享同一个模型，只付一份显存。

| | applet agent | COS agent | USIM agent |
|---|---|---|---|
| 角色提示 | Java Card applet 专家 | COS 底层专家 | USIM 规范专家 |
| 知识库 | Java Card API + GlobalPlatform | ISO 7816 底层 + COS 源码 | ETSI 102 221 + 3GPP 31.102 + 文件系统 |
| 工具 | jCardSim / 编译器 | 代码分析 | APDU / TLV 编解码 |

**实现形态**：一个界面上三个模式切换，开发者**手动选**当前在写哪块，后端加载对应配置请求同一个模型。向量库用一个，按 collection 分三块即可。

> ⚠️ **不要上"真·多 agent"**（orchestrator 协调多子 agent）——对当前规模是过度设计，调试成本高。等真有跨域场景再加上层协调。

```
                  ┌─ applet 模式: 提示A + 知识库A + 工具A ─┐
用户选模式 ──────→ ├─ COS 模式:   提示B + 知识库B + 工具B ─┤ ──→ 同一个模型服务（DeepSeek-Coder-V2-Lite）
                  └─ USIM 模式:  提示C + 知识库C + 工具C ─┘
```

---

## 四、推理框架：先 Ollama，需要再换 vLLM

判断标准只有一个——**是否有并发请求**，跟"几个 agent / 上不上服务器"无关。

- 开发者串行使用（很可能是当前情况）→ **Ollama 就够**，离线部署和运维都简单。
- 多人同时用 / agent 高频并发调用 / 要压满大显卡 → 才需要 **vLLM**。

**建议：前期用 Ollama**，瓶颈在知识库和提示词而非推理性能。程序面向 OpenAI 兼容接口写，将来换 vLLM **基本只改一个 `BASE_URL`**，零成本迁移。真遇到卡顿再换。

---

## 五、离线部署要点（将来上 vLLM 时）

- 模型权重在联网机器下载好，拷进去，启动指向**本地绝对路径**。
- 设置离线环境变量：
  - `HF_HUB_OFFLINE=1`
  - `TRANSFORMERS_OFFLINE=1`
- 依赖优先用 **Docker 镜像**（`docker save` / `docker load`），避免离线配 CUDA 踩坑。
- 前提：服务器装好 **NVIDIA 驱动 + nvidia-container-toolkit**（这部分可能也要离线装）。

---

## 六、RAG 是重中之重

通用模型对 Java Card 这种细分领域知识薄、爱想当然，**核心投入放在 RAG**：把规范文档、API、GP 文档、COS / applet 源码切块入向量库（Chroma）。这是和"通用 coding 助手"拉开差距的关键。

**最容易出错、最该用 RAG 补的领域坑：**

- **Java Card 是 Java 受限子集**：无 `float` / `double` / `String`、`int` 视卡而定、无完整 GC。最常见失败模式是"语法对但卡上跑不了"。
- **内存模型**：persistent（EEPROM/Flash）vs transient（RAM）、事务（`beginTransaction`）。
- **APDU / BER-TLV 编码**、USIM 文件系统（MF / DF / EF、FCP）。
- **GlobalPlatform 卡管理**（SCP02 / 03、load / install）。

---

## 七、项目文件结构

```
local-llm/
├── .env                        # 本地配置（不入库）：BASE_URL、模型名、向量库路径等
├── .env.example                # 配置模板（入库）
├── docker-compose.yml          # 可选：一键拉起后端 + Chroma
├── requirements.txt            # Python 依赖
│
├── backend/
│   ├── main.py                 # FastAPI 入口，提供 POST /chat 接口
│   │                           #   入参：{mode: "applet"|"cos"|"usim", query: "..."}
│   │                           #   出参：{answer: "...", sources: [...]}
│   │
│   ├── agents/
│   │   ├── base.py             # BaseAgent：加载提示词 → 调 retriever → 拼 prompt → 调模型
│   │   ├── applet.py           # AppletAgent：指定 applet 系统提示 + applet collection
│   │   ├── cos.py              # COSAgent：指定 COS 系统提示 + cos collection
│   │   └── usim.py             # USIMAgent：指定 USIM 系统提示 + usim collection
│   │
│   ├── rag/
│   │   ├── embedder.py         # BAAI/bge-m3 封装（sentence-transformers），返回 numpy 向量
│   │   ├── vectorstore.py      # Chroma client，管理 applet / cos / usim 三个 collection
│   │   └── retriever.py        # 给定 (query, mode) → 调 embedder → 查 Chroma → 返回 top-k chunks
│   │
│   ├── llm/
│   │   └── client.py           # openai SDK 封装，base_url 指向 Ollama；将来换 vLLM 只改此处
│   │
│   ├── ingest/
│   │   ├── run_ingest.py       # 入口：python -m backend.ingest.run_ingest --mode applet
│   │   ├── chunker.py          # 文档 vs 代码用不同 chunk 策略（代码按类/方法切，文档按段落）
│   │   └── loaders.py          # PDF / .txt / .java / .c 加载器，统一返回 Document 列表
│   │
│   ├── tools/                  # 阶段 2 再填充
│   │   └── apdu.py             # APDU / TLV 编解码工具（占位）
│   │
│   └── prompts/
│       ├── applet.txt          # applet agent 系统提示词
│       ├── cos.txt             # COS agent 系统提示词
│       └── usim.txt            # USIM agent 系统提示词
│
├── data/
│   ├── raw/                    # 原始知识库文件（入库，见下方说明）
│   │   ├── applet/
│   │   │   └── PBOC/
│   │   │       ├── code/       # PBOC applet Java 源码 + 测试脚本
│   │   │       └── spec/       # PBOC / UICS 规范 PDF（中/英/韩）
│   │   ├── cos/                # COS 源码、ISO 7816 文档（待填充）
│   │   └── usim/               # ETSI 102.221、3GPP 31.102（待填充）
│   │
│   └── vectordb/               # Chroma 持久化（不入库，运行 ingest 后生成）
│
└── frontend/                   # 阶段 1 后期再做，先用 curl / Swagger UI 测试
    └── ...
```

---

## 八、落地路线

> **起点：PBOC applet agent**（已有源码 + 规范文档，知识库边界最清晰）

| 阶段 | 内容 | 当前知识库来源 |
|---|---|---|
| **0** | Ollama 跑通 DeepSeek-Coder-V2-Lite-Instruct，`curl` 验通 | — |
| **1** | 接入 RAG：PBOC 源码 + 规范 PDF 入 Chroma，做"规范问答 + 代码生成" | `data/raw/applet/PBOC/` |
| **2** | 接工具（jCardSim / 编译 / APDU）→ 能自我验证代码的 agent | applet collection |
| **3** | 复制骨架做 COS / USIM agent，换知识库即可 | `data/raw/cos/`、`data/raw/usim/` |
| **4** | 建评估集，按需用内部代码做 LoRA 微调（优先级最低） | — |

**先把 PBOC applet agent 做扎实**，跑通"提示 + RAG + 工具"这条链路，COS 和 USIM 复制骨架换知识库，工作量小很多。三个并行从零做，容易三个都半成品。

---

## 九、已有 RAG 知识库素材（`data/raw/applet/PBOC/`）

### 源码（`code/applet_PBOCv3.0_Extended_v1.01/`）

| 路径 | 内容 |
|---|---|
| `src/com/konai/pboc/` | PBOC applet Java 源码（PBOC.java、EMVUtil.java 等 10 个类） |
| `script/BASIC_TEST/` | 基础功能测试脚本（DC / EC / qPBOC，含 perso 脚本） |
| `script/PBOC3.0_testv1.2/` | PBOC 3.0 兼容性测试脚本 |
| `doc/PBOC2013/` | PBOC 2013 规范 PDF（Part 3–17，英文） |
| `cap/` | 编译后的 CAP 文件（二进制，不入 RAG，git 中排除） |

### 规范（`spec/`）

| 目录 | 内容 |
|---|---|
| `UICS2017-EN/` | 中国银联 IC 卡技术规范 2017 英文版（Basic / Auxiliary / Product Spec） |
| `UICS2017-CN/` | 中国银联 IC 卡技术规范 2017 中文版 + 移动支付规范 |
| `UICS2014-KR/` | 中国银联 IC 卡技术规范 2014 韩文版（基础 / 보고 / 제품 규격） |

> RAG 入库优先级：`src/` Java 源码 > `UICS2017-EN/` 英文规范 > `doc/PBOC2013/` 英文规范。中韩文规范作为补充（bge-m3 支持多语言）。

---

## 十、下一步待确认

> **COS 源码和 USIM 规范（ETSI / 3GPP）是否已有电子版可入库？**

这决定后两个 agent 的 RAG 怎么搭。PBOC applet agent 可先不等这个，独立推进。
