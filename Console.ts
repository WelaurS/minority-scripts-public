let ConsoleScript: ScriptDescription = {};

// @ts-ignore
let [screenW, screenH] = Renderer.GetScreenSize();

let logFont;
let logFontBold;

// фикс шрифта, а то нихера не видно
if (screenW === 2880) {
    logFont = Renderer.LoadFont('Tahoma', 32, 600);
    logFontBold = Renderer.LoadFont('Tahoma', 36, Enum.FontWeight.BOLD);
} else {
    logFont = Renderer.LoadFont('Tahoma', 18, 650);
    logFontBold = Renderer.LoadFont('Tahoma', 20, Enum.FontWeight.BOLD);
}

let [, lineH] = Renderer.GetTextSize(logFont, 'A');
let [, lineHBold] = Renderer.GetTextSize(logFontBold, 'A');

let numShowLines = Math.floor(Math.floor(screenH * 0.33) / lineH);
let logH = numShowLines * lineH;
let logY = screenH - logH;

let isVisible = !!Config.ReadInt('console', 'show', 0);
let displayLinesNum = 100;

ConsoleScript.OnUpdate = () => {
    if (
        Input.IsKeyDownOnce(Enum.ButtonCode.KEY_F10) &&
        !Input.IsKeyDown(Enum.ButtonCode.KEY_LSHIFT)
    ) {
        isVisible = !isVisible;

        Config.WriteInt('console', 'show', isVisible ? 1 : 0);
    }
};

ConsoleScript.OnDraw = () => {
    if (!isVisible) {
        return;
    }

    Renderer.SetTopMost(true);
    let messages = Log.GetLog(displayLinesNum);

    Renderer.SetDrawColor(0, 0, 0, 200);
    Renderer.DrawFilledRect(0, logY, screenW, logH);

    let text_x = 0;
    let drawPos = 0;
    let startArrIndex = messages.length - numShowLines;

    if (startArrIndex < 0) {
        startArrIndex = 0;
    }

    Renderer.SetDrawColor(0, 0, 0, 225);
    if (Menu.GetLocale() === 'ru') {
        const text = 'Чтобы закрыть эту панель нажмите F10';
        let [tSizeX] = Renderer.GetTextSize(logFontBold, text);
        Renderer.SetDrawColor(255, 0, 0, 200);
        Renderer.DrawFilledRect(0, logY - lineH, tSizeX, lineH);

        Renderer.SetDrawColor(255, 255, 255, 255);
        Renderer.DrawText(
            logFontBold,
            text_x,
            logY - lineH,
            text
        );
    } else {
        const text = 'To close this panel press F10';
        let [tSizeX] = Renderer.GetTextSize(logFontBold, text);
        Renderer.SetDrawColor(255, 0, 0, 255);
        Renderer.DrawFilledRect(0, logY - lineHBold, tSizeX + 4, lineHBold + 4);

        Renderer.SetDrawColor(255, 255, 255, 255);
        Renderer.DrawText(
            logFontBold,
            text_x + 2,
            logY - lineHBold + 2,
            text
        );
    }

    for (let lineNum = startArrIndex; lineNum < messages.length; lineNum++) {
        let message = messages[lineNum];

        if (message.str.indexOf('loaded ') > -1) {
            Renderer.SetDrawColor(50, 190, 50, 255);
        } else if (message.str.indexOf('V8 version') > -1) {
            Renderer.SetDrawColor(90, 90, 255, 255);
        } else if (message.str.indexOf('Error:') > -1) {
            Renderer.SetDrawColor(230, 50, 50, 255);
        } else {
            Renderer.SetDrawColor(255, 255, 255, 255);
        }

        Renderer.DrawText(
            logFont,
            text_x,
            logY + drawPos * lineH,
            message.index + ': ' + message.str
        );
        drawPos++;
    }
};

RegisterScript(ConsoleScript, 'Console');
