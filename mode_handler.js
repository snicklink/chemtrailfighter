// Updated mode handling code

// Function to properly activate a game mode and cancel any existing modes
function activateGameMode(mode, duration = 0) {
    console.log(`Activating mode: ${mode} (previous modes - star: ${starTimer > 0}, onyx: ${onyxTimer > 0}, schwab: ${schwabMode})`);
    
    // Cancel all existing modes first
    starTimer = 0;
    onyxTimer = 0;
    schwabMode = false;
    schwabModeTimer = 0;
    isInverted = false;
    cursorFlashing = false;
    
    // Set the current active mode
    currentMode = mode;
    
    // Activate the requested mode
    switch(mode) {
        case 'star':
            starTimer = duration || 600; // 10 seconds at 60 FPS
            cursorFlashing = true;
            flashOpacity = 0.5;
            flashDirection = -1;
            consecutiveStarKills = 0;
            
            // Spawn 7 extra planes when star mode begins (up to max 10 planes total)
            const extraPlanesToSpawn = Math.min(7, 10 - planes.length);
            console.log(`STAR MODE: Spawning ${extraPlanesToSpawn} extra planes`);
            
            // Spawn planes with a slight delay between each one
            for (let i = 0; i < extraPlanesToSpawn; i++) {
                setTimeout(() => {
                    if (planes.length < 10) { // Double-check we're still under the limit
                        const starPlane = new Plane();
                        planes.push(starPlane);
                        console.log(`STAR MODE: Extra plane ${i+1}/${extraPlanesToSpawn} spawned. Total planes: ${planes.length}`);
                    }
                }, i * 200); // 200ms delay between each plane spawn
            }
            
            // Display announcement
            messages.push(new CenterMessage("STAR MODE", '#00ffff', 35, 150));
            break;
            
        case 'onyx': 
            onyxTimer = duration || 840;
            isInverted = true;
            
            // Display announcement
            messages.push(new CenterMessage("SCHWURBLER MODE", '#ff00ff', 35, 150));
            break;
            
        case 'schwab':
            schwabMode = true;
            schwabModeTimer = duration || schwabModeMaxTime;
            
            // Display announcement
            messages.push(new CenterMessage("SCHWAB MODE", '#ff00ff', 35, 150));
            break;
            
        case 'normal':
        default:
            // Normal mode is the default when all other modes are canceled
            console.log("Returning to normal mode");
            break;
    }
    
    // Update the music to match the new mode
    if (soundEnabled) {
        if (mode === 'normal') {
            playModeMusic('normal');
        } else {
            playModeMusic(mode);
        }
    }
    
    // Update positions of any center messages
    updateCenterMessagePositions();
    
    console.log(`Mode activated: ${mode}`);
}

// Updated mode timer handling for the game loop
function handleModeTimers() {
    // Handle mode timers based on the current active mode
    switch(currentMode) {
        case 'star':
            if (starTimer > 0) {
                starTimer--;
                if (starTimer === 0) {
                    // Reset cursor flashing effect
                    cursorFlashing = false;
                    // Reset consecutive plane kills counter
                    consecutiveStarKills = 0;
                    
                    // Return to normal mode when timer expires
                    activateGameMode('normal');
                }
            }
            break;
            
        case 'onyx':
            if (onyxTimer > 0) {
                onyxTimer--;
                if (onyxTimer === 0) {
                    isInverted = false;
                    
                    // Return to normal mode when timer expires
                    activateGameMode('normal');
                }
            }
            break;
            
        case 'schwab':
            if (schwabModeTimer > 0) {
                schwabModeTimer--;
                if (schwabModeTimer === 0) {
                    schwabMode = false;
                    messages.push(new CenterMessage("SCHWAB MODE ENDED", '#ff00ff', 35, 180));
                    
                    // Return to normal mode when timer expires
                    activateGameMode('normal');
                }
            }
            break;
            
        case 'normal':
        default:
            // No timers to handle in normal mode
            break;
    }
} 