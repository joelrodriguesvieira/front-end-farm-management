# Script para criar dados iniciais na API

Write-Host "🚀 Iniciando criação de dados..." -ForegroundColor Green

$apiBase = "http://localhost:3000/api"

# 1. Criar Devices
Write-Host "📦 Criando devices..." -ForegroundColor Cyan

$devices = @(
    @{name="Lâmpada"; type="lamp"; status="off"},
    @{name="Ventilador"; type="fan"; status="off"},
    @{name="Bomba de Água"; type="pump"; status="off"}
)

foreach ($device in $devices) {
    $body = $device | ConvertTo-Json
    try {
        $response = Invoke-WebRequest -Uri "$apiBase/devices" -Method Post -ContentType "application/json" -Body $body -UseBasicParsing
        Write-Host "✅ Device '$($device.name)' criado" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erro ao criar device: $_" -ForegroundColor Red
    }
}

# 2. Criar Config
Write-Host "⚙️  Criando configuração..." -ForegroundColor Cyan

$config = @{
    mode="auto"
    light=@{control="manual"; ldrThreshold=300; onTime="06:00"; offTime="18:00"}
    temperature=@{min=20; max=30}
    ration=@{minWeight=100; maxWeight=500}
    saveInterval=300000
}

$body = $config | ConvertTo-Json
try {
    $response = Invoke-WebRequest -Uri "$apiBase/config" -Method Put -ContentType "application/json" -Body $body -UseBasicParsing
    Write-Host "✅ Configuração criada" -ForegroundColor Green
} catch {
    Write-Host "❌ Erro ao criar config: $_" -ForegroundColor Red
}

# 3. Criar Sensores
Write-Host "📊 Criando sensores..." -ForegroundColor Cyan

for ($i = 0; $i -lt 6; $i++) {
    $temp = 22 + (Get-Random -Minimum -3 -Maximum 5)
    $sensor = @{
        temperature=$temp
        humidity=55
        luminosity=(400 + (Get-Random -Minimum -100 -Maximum 100))
        rationWeight=(280 + (Get-Random -Minimum -20 -Maximum 40))
        waterLevel=$true
    }
    
    $body = $sensor | ConvertTo-Json
    try {
        $response = Invoke-WebRequest -Uri "$apiBase/sensors" -Method Post -ContentType "application/json" -Body $body -UseBasicParsing
        Write-Host "✅ Sensor leitura $($i+1) criado" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erro ao criar sensor: $_" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 300
}

# 4. Criar Ações
Write-Host "🎯 Criando ações..." -ForegroundColor Cyan

$actions = @(
    @{userId=1; system="ration"; action="feed"; quantity=50},
    @{userId=1; system="ration"; action="feed"; quantity=100},
    @{userId=1; system="light"; action="turn_on"},
    @{userId=1; system="light"; action="turn_off"},
    @{userId=1; system="water"; action="pump_on"}
)

foreach ($action in $actions) {
    $body = $action | ConvertTo-Json
    try {
        $response = Invoke-WebRequest -Uri "$apiBase/actions" -Method Post -ContentType "application/json" -Body $body -UseBasicParsing
        Write-Host "✅ Ação '$($action.action)' criada" -ForegroundColor Green
    } catch {
        Write-Host "❌ Erro ao criar ação: $_" -ForegroundColor Red
    }
    Start-Sleep -Milliseconds 300
}

Write-Host "`n✨ Configuração concluída!" -ForegroundColor Green
Write-Host "Acesse http://localhost:3002 para ver os dados" -ForegroundColor Yellow
