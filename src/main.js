// Main window
let canvas = document.getElementById("scrollerCanvas");
let ctx = canvas.getContext("2d");
let textLocs = [window.innerWidth]; // Array to allow for multiple text on screen in future (seamless scrolling, no gap at end)

function render()
{
    // Draw elements based on config.json values
    ctx.fillStyle = configContent.bgColour;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = configContent.textColour;
    ctx.font = configContent.font;

    ctx.textBaseline = "hanging";
    for (let i=0; i<textLocs.length; i++)
    {
        ctx.fillText(configContent.text, textLocs[i], parseInt(configContent.margin));

        // Move text back to right of window when it moves completely out of view (reset position for infinite loop)
        if (textLocs[i] + ctx.measureText(configContent.text).width < 0) textLocs[i] = canvas.width;
    }
}
function update()
{
    for (let i=0; i<textLocs.length; i++)
    {
        textLocs[i]--;
    }
    render();
}

function resizeWindow()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeWindow);
resizeWindow();

window.api.receive("cfgReturn", (data) => { configContent = data; console.log(data); window.setInterval(update, 1000 / parseInt(data.speed)); });
window.api.send("cfgRequest");
