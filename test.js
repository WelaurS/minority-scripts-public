let script = {};

script.OnScriptLoad = () => {
    console.log(`--> Test script loaded`);
};

script.OnDraw = () => {
    Renderer.SetDrawColor(0, 0, 0, 255);
    Renderer.DrawFilledRect(0, 0, 100, 100);
};

script.OnScriptUnload = () => {
    console.log(`--> Test script unloaded`);
};

RegisterScript(script);
