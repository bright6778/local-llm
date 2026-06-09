---
name: gemma-ollama-windows
description: Windows(특히 NVIDIA 외장 GPU 없이 CPU로 추론하는 노트북/데스크톱)에서 Ollama로 로컬 Gemma 등 소형 모델을 배포하고 실행하는 전체 절차. 하드웨어 점검, Ollama 설치, 모델 다운로드, 커맨드라인/API/Node.js 테스트, 모델이 실제로 로컬에서 도는지 확인, 자주 쓰는 운영 명령과 주의사항을 다룬다. 사용자가 "로컬 LLM / 로컬 대형 모델 / 오프라인 모델", "Ollama", "Gemma(gemma3)", "내 컴퓨터에서 모델 돌리기", "localhost:11434 / 127.0.0.1:11434", "그래픽카드 없이 / 내장 그래픽으로 모델 돌리기 / CPU 추론이 느림", "이게 로컬인지 클라우드인지 어떻게 확인하나" 같은 상황을 언급하면, "Ollama"나 "배포"라는 단어를 정확히 쓰지 않더라도 본 skill을 사용한다.
---

# Windows에서 Ollama로 로컬 Gemma 배포하기

Windows 환경(특히 **NVIDIA 외장 GPU가 없어 CPU로만 추론**하는 노트북/데스크톱)에서 로컬 Gemma 모델의 배포, 테스트, 검증을 돕는다. 모든 작업은 PowerShell로 진행한다.

## 적용 전제와 기종 판단

먼저 대상 기종을 확인한 뒤 어떤 모델을 쓸지 결정한다.

- NVIDIA 외장 GPU 없음(내장 그래픽, 예: Intel Iris Xe): 추론이 CPU에서 돌아가며 **느린 것이 정상이고, 배포 실패를 의미하지 않는다**. 1B / 3B / 4B 규모, `Q4` 양자화 소형 모델을 우선 선택한다.
- 메모리 16GB 안팎: `gemma3:4b`(디스크 약 3.3 GB, 약 4.3B 파라미터, Q4_K_M)는 정상 동작한다. 응답이 너무 느리면 `gemma3:1b`로 낮춘다.
- NVIDIA 외장 GPU 있음: 더 큰 모델도 시도 가능하지만, 본 skill은 기본적으로 GPU 없는 보수적 경로를 따른다.

로컬 서비스 기본 주소: `http://127.0.0.1:11434`.

## 배포 절차

### 1. 하드웨어 점검

```powershell
Get-ComputerInfo | Select-Object OsName, OsVersion, CsSystemType, CsProcessors, CsTotalPhysicalMemory
Get-CimInstance Win32_VideoController | Select-Object Name, AdapterRAM, DriverVersion
```

이를 근거로 외장 GPU 유무와 메모리 용량을 확인하고 모델 규모를 정한다(위 참고).

### 2. Ollama 설치

winget을 우선 사용한다(가장 간편하며 최신 버전 자동 설치):

```powershell
winget install --id Ollama.Ollama --silent --accept-package-agreements --accept-source-agreements
```

`winget`이 멈추거나 사용할 수 없으면, **GitHub Release**에서 공식 Windows 설치 파일을 받는다(`<VERSION>`을 대상 버전으로 교체. releases 페이지의 최신 안정 버전 권장):

```powershell
Invoke-WebRequest `
  -Uri https://github.com/ollama/ollama/releases/download/v<VERSION>/OllamaSetup.exe `
  -OutFile .\OllamaSetup-<VERSION>.exe
```

**설치 파일 해시 검증**(중요. 불완전하거나 변조된 파일을 막기 위함):

```powershell
Get-FileHash .\OllamaSetup-<VERSION>.exe -Algorithm SHA256
```

얻은 SHA256을 해당 버전의 **공식 manifest / release 페이지에 공개된 체크섬**과 한 글자씩 대조한다. 어딘가에 하드코딩된 해시를 기억으로 쓰지 말 것 — 해시는 버전마다 바뀌므로 매번 현재 버전의 공식 값을 조회한다.

> 주의 경험: `https://ollama.com/download/OllamaSetup.exe`에서 직접 받으면 가끔 **불완전한 파일**을 받게 되어 검증을 통과하지 못한다. 이런 경우 GitHub Release 링크를 쓰고, 공식 공개 해시를 기준으로 삼는다.

무인 설치:

```powershell
Start-Process -FilePath .\OllamaSetup-<VERSION>.exe `
  -ArgumentList '/VERYSILENT','/SUPPRESSMSGBOXES','/NORESTART' `
  -Wait
```

설치 확인:

```powershell
ollama --version
```

`ollama`를 찾을 수 없다는 메시지가 나오면 보통 현재 PowerShell 창의 PATH가 갱신되지 않은 것이다. 새 창을 열거나 전체 경로를 사용한다:

```powershell
& "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe" --version
```

(기본 설치 위치는 `%LOCALAPPDATA%\Programs\Ollama`.)

### 3. 로컬 모델 다운로드

```powershell
ollama pull gemma3:4b
```

회사망이나 약한 네트워크에서는 대용량 파일이 느릴 수 있다. `ollama pull`은 **이어받기**를 지원하므로, 중단되면 같은 명령을 다시 실행하면 된다.

선택 가능한 대체 모델:

```powershell
ollama pull gemma3:1b      # CPU가 너무 느릴 때 더 가벼운 선택
ollama pull qwen2.5:3b
ollama pull qwen3:4b
```

## 테스트 방법

모델이 존재하는지 확인:

```powershell
ollama list
```

커맨드라인 채팅 테스트:

```powershell
ollama run gemma3:4b
```

진입 후 "한 문장으로 답해줘: 너는 어떤 모델이야?" 같은 질문으로 테스트한다. 종료하려면 `/bye` 입력.

API 서비스 테스트(로드/사용 가능 모델 조회):

```powershell
Invoke-RestMethod http://127.0.0.1:11434/api/tags
```

PowerShell로 생성 API 호출:

```powershell
$body = @{
  model  = "gemma3:4b"
  prompt = "로컬 Gemma 모델이 정상 실행됐음을 한 문장으로 설명해줘."
  stream = $false
} | ConvertTo-Json

Invoke-RestMethod http://127.0.0.1:11434/api/generate `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

Node.js 호출 예시:

```javascript
const res = await fetch("http://127.0.0.1:11434/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "gemma3:4b",
    prompt: "너 자신을 한 문장으로 소개해줘.",
    stream: false,
    options: {
      temperature: 0.2,
      num_predict: 120
    }
  })
});

console.log(await res.json());
```

## 로컬 모델인지 확인하는 방법

**모델 본인의 말은 믿지 말 것.** Gemma는 학습 데이터에 따라 "나는 Google 서버에서 실행된다"라고 답할 수 있는데, 이는 모델이 자신의 현재 실행 환경을 모르기 때문에 생기는 환각이지 사실이 아니다. 모델의 자기 진술이 아니라 **실행 사실**을 확인한다:

```powershell
ollama list                                                        # 해당 모델이 실제로 로컬에 받아져 있음
Get-ChildItem "$env:USERPROFILE\.ollama\models" -Recurse | Measure-Object Length -Sum   # 모델 파일의 디스크 사용량
Get-Process -Name ollama | Select-Object ProcessName,Id,Path        # 로컬에 ollama 프로세스 존재
netstat -ano | Select-String ':11434'                               # 포트 리스닝 상태
```

`127.0.0.1`은 로컬 루프백 주소다. `127.0.0.1:11434 LISTENING`이 보이면 **로컬** Ollama 서비스에 연결되어 있다는 뜻이다.

가장 직관적인 확인 방법 — **네트워크를 끊은 뒤** 실행:

```powershell
ollama run gemma3:4b
```

네트워크가 끊긴 상태에서도 정상 응답하면 로컬 추론임이 증명된다.

## 자주 쓰는 운영 명령

```powershell
ollama list                                  # 다운로드된 모델 보기
ollama run gemma3:4b                          # 실행 및 채팅
ollama pull gemma3:4b                         # 모델 다운로드/업데이트
ollama ps                                     # 현재 메모리에 로드된 모델 보기
ollama rm gemma3:4b                           # 모델 파일 삭제
Invoke-RestMethod http://127.0.0.1:11434/api/tags   # 로컬 API 온라인 여부 확인
```

## 주의사항

- 모델은 기본적으로 `%USERPROFILE%\.ollama`(즉 `C:\Users\<사용자명>\.ollama`)에 저장된다.
- Ollama는 기본적으로 로컬 `127.0.0.1:11434`만 수신한다. **회사/사무실 네트워크에서 LAN에 노출하지 말 것** — 타인이 접근할 수 있다.
- 오래된 인코딩 환경의 PowerShell은 커맨드라인의 한글/비ASCII 인자를 물음표로 깨뜨릴 수 있다. 커맨드라인에 직접 텍스트를 넘기기보다 **UTF-8 JSON으로 API를 호출**하는 편이 안정적이다.
- 외장 GPU 없는 기기에서 응답이 느린 것은 정상이다. CPU가 버거우면 배포 실패를 의심하기보다 더 작은 모델(예: `gemma3:1b`)로 바꾼다.
- 사용자에게 버전, 해시, 경로를 보고할 때는 **실제로 조회한 현재 값**을 인용하고, 본 문서의 플레이스홀더 예시를 복사하지 말 것.
