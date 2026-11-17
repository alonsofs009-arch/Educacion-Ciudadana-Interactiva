@echo off
setlocal
cd /d "%~dp0"
if not exist "node_modules" (
  echo Instalando dependencias la primera vez...
  call npm install
  if errorlevel 1 (
    echo No se pudieron instalar las dependencias. Revisa Node.js y la conexion a internet.
    pause
    exit /b 1
  )
)
echo Abriendo Educacion Ciudadana en el navegador...
call npm run dev -- --open
endlocal
