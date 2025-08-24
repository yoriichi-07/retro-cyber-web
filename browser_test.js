
// Test the puzzle system directly in browser
console.log("=== PHASE 4 PUZZLE SYSTEM TEST ===");

// Test basic commands
if (window.app && window.app.terminal) {
    const terminal = window.app.terminal;
    
    setTimeout(() => {
        console.log("Testing puzzle command...");
        terminal.executeCommand("puzzle");
    }, 2000);
    
    setTimeout(() => {
        console.log("Testing hint command...");
        terminal.executeCommand("hint");
    }, 4000);
    
    setTimeout(() => {
        console.log("Testing trace matrix command...");
        terminal.executeCommand("trace matrix");
    }, 6000);
    
    setTimeout(() => {
        console.log("Testing decode command...");
        terminal.executeCommand("decode caesar 21 NRFFRTZ_LBEX");
    }, 8000);
    
    setTimeout(() => {
        console.log("Testing pattern command...");
        terminal.executeCommand("pattern");
    }, 10000);
    
    setTimeout(() => {
        console.log("Testing secrets command...");
        terminal.executeCommand("secrets");
    }, 12000);
    
    setTimeout(() => {
        console.log("Testing konami command...");
        terminal.executeCommand("konami");
    }, 14000);
    
    setTimeout(() => {
        console.log("Testing navigate command...");
        terminal.executeCommand("navigate sector7/classified");
    }, 16000);
    
} else {
    console.error("Terminal not available");
}

console.log("Puzzle test sequence initiated...");

