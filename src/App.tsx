import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Star, Heart, Zap } from 'lucide-react';

interface Obstacle {
  x: number;
  width: number;
  height: number;
  spawnTimestamp: number;
}

interface Cloud {
  x: number;
  y: number;
  size: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [showPauseMenu, setShowPauseMenu] = useState(false);
  const gameSpeed = 1;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const context = ctx;

    // Enhanced visual parameters
    const baseWidth = 800;
    const baseHeight = 240;
    const baseGroundY = 180;

    let lastTime = 0;
    let obstacleTimer = 0;
    let nextObstacleDelay = randomDelay();
    let speed = 200 * gameSpeed;
    let particles: Particle[] = [];

    const cat = {
      x: 80,
      y: 0,
      width: 35,
      height: 30,
      velocityY: 0,
      gravity: 1000,
    };

    let tailPhase = 0;
    let earPhase = 0;
    const tailSpeed = 0.008 * gameSpeed;
    const earSpeed = 0.005 * gameSpeed;
    const maxTailAngle = Math.PI / 4;
    const maxEarAngle = Math.PI / 32;

    let animationId: number;
    let obstacles: Obstacle[] = [];
    let clouds: Cloud[] = [];
    let gameStartTimestamp = 0;
    let backgroundOffset = 0;

    function randomDelay() {
      return (800 + Math.random() * 600) / gameSpeed;
    }

    function initClouds() {
      clouds = [];
      for (let i = 0; i < 5; i++) {
        clouds.push({
          x: 200 + i * 200,
          y: 30 + Math.random() * 40,
          size: 40 + Math.random() * 40,
        });
      }
    }

    function createParticles(x: number, y: number, color: string) {
      for (let i = 0; i < 8; i++) {
        particles.push({
          x: x + Math.random() * 20,
          y: y + Math.random() * 20,
          vx: (Math.random() - 0.5) * 200,
          vy: (Math.random() - 0.5) * 200,
          life: 1,
          maxLife: 0.5 + Math.random() * 0.5,
          color: color
        });
      }
    }

    function updateParticles(deltaTime: number) {
      particles = particles.filter(p => {
        p.x += p.vx * deltaTime / 1000;
        p.y += p.vy * deltaTime / 1000;
        p.life -= deltaTime / 1000;
        return p.life > 0;
      });
    }

    function drawParticles() {
      particles.forEach(p => {
        const alpha = p.life / p.maxLife;
        context.save();
        context.globalAlpha = alpha;
        context.fillStyle = p.color;
        context.beginPath();
        context.arc(p.x, p.y, 3, 0, Math.PI * 2);
        context.fill();
        context.restore();
      });
    }

    function resetGame() {
      lastTime = 0;
      obstacleTimer = 0;
      nextObstacleDelay = randomDelay();
      speed = 200 * gameSpeed;
      cat.y = 0;
      cat.velocityY = 0;
      setCurrentScore(0);
      setIsGameOver(false);
      obstacles = [];
      particles = [];
      initClouds();
      gameStartTimestamp = 0;
      tailPhase = 0;
      earPhase = 0;
      backgroundOffset = 0;
    }

    function handleJump() {
      if (cat.y >= 0) {
        cat.velocityY = -450;
        createParticles(cat.x + cat.width / 2, baseGroundY, '#FFB6C1');
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (!isRunning && !showPauseMenu) {
          setIsRunning(true);
          resetGame();
        } else if (!isGameOver && !showPauseMenu) {
          handleJump();
        } else if (isGameOver) {
          setIsRunning(true);
          resetGame();
        }
      } else if (e.code === 'Escape') {
        e.preventDefault();
        if (isRunning && !isGameOver) {
          setShowPauseMenu(!showPauseMenu);
          setIsRunning(!showPauseMenu);
        }
      }
    }

    function handleMouseDown() {
      if (!isRunning && !showPauseMenu) {
        setIsRunning(true);
        resetGame();
      } else if (!isGameOver && !showPauseMenu) {
        handleJump();
      } else if (isGameOver) {
        setIsRunning(true);
        resetGame();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('mousedown', handleMouseDown);

    function drawBackground(deltaTime: number) {
      // Soft gradient sky with warm colors
      const gradient = context.createLinearGradient(0, 0, 0, baseGroundY);
      gradient.addColorStop(0, '#fef7e0');
      gradient.addColorStop(1, '#fce4ec');
      context.fillStyle = gradient;
      context.fillRect(0, 0, baseWidth, baseGroundY + 20);

      // Soft ground
      backgroundOffset += speed * deltaTime / 2000;
      if (backgroundOffset > 40) backgroundOffset = 0;

      context.fillStyle = '#f3e5f5';
      context.fillRect(0, baseGroundY, baseWidth, baseHeight - baseGroundY);

      // Cute ground pattern
      context.strokeStyle = '#e1bee7';
      context.lineWidth = 2;
      for (let x = -backgroundOffset; x < baseWidth; x += 40) {
        context.beginPath();
        context.moveTo(x, baseGroundY);
        context.lineTo(x + 20, baseGroundY + 5);
        context.lineTo(x + 40, baseGroundY);
        context.stroke();
      }
    }

    function drawCloud(cloud: Cloud, deltaTime: number) {
      cloud.x -= (speed * 0.3 * deltaTime) / 1000;
      if (cloud.x + cloud.size * 2 < 0) {
        cloud.x = baseWidth + Math.random() * 200;
        cloud.y = 30 + Math.random() * 40;
        cloud.size = 40 + Math.random() * 40;
      }

      const cx = cloud.x;
      const cy = cloud.y;
      const s = cloud.size;

      // Fluffy cloud
      context.fillStyle = '#f8bbd9';
      context.beginPath();
      context.arc(cx, cy, s * 0.5, 0, Math.PI * 2);
      context.arc(cx + s * 0.4, cy + s * 0.1, s * 0.4, 0, Math.PI * 2);
      context.arc(cx - s * 0.3, cy + s * 0.1, s * 0.4, 0, Math.PI * 2);
      context.fill();
    }

    function drawCat(deltaTime: number) {
      // Physics
      cat.velocityY += (cat.gravity * deltaTime) / 1000;
      cat.y = Math.min(cat.y + (cat.velocityY * deltaTime) / 1000, 0);
      if (cat.y > 0) {
        cat.y = 0;
        cat.velocityY = 0;
      }

      const x = cat.x;
      const y = baseGroundY - cat.height + cat.y;
      const w = cat.width;
      const h = cat.height;

      tailPhase += deltaTime * tailSpeed;
      earPhase += deltaTime * earSpeed;
      const tailAngle = Math.sin(tailPhase) * maxTailAngle;
      const earAngle = Math.sin(earPhase) * maxEarAngle;

      // Cat body (orange/ginger cat)
      context.fillStyle = '#ff9800';

      // Main body (oval)
      context.beginPath();
      context.ellipse(x + w / 2, y + h * 0.7, w * 0.4, h * 0.4, 0, 0, Math.PI * 2);
      context.fill();

      // Head (circle)
      context.beginPath();
      context.ellipse(x + w * 0.7, y + h * 0.35, w * 0.35, h * 0.35, 0, 0, Math.PI * 2);
      context.fill();

      // Cat stripes
      context.fillStyle = '#ff6f00';
      context.fillRect(x + w * 0.2, y + h * 0.5, w * 0.1, h * 0.3);
      context.fillRect(x + w * 0.4, y + h * 0.5, w * 0.1, h * 0.3);
      context.fillRect(x + w * 0.6, y + h * 0.5, w * 0.1, h * 0.3);

      // Cat ears with animation (สามเหลี่ยมหงาย)
      context.fillStyle = '#ff9800';
      context.save();
      context.translate(x + w * 0.55, y + h * 0.15);
      context.rotate(earAngle);
      // วาดหูเป็นสามเหลี่ยมหงาย: apex อยู่ที่ (0, -12), ฐานอยู่ระหว่าง (-8,0) ถึง (8,0)
      context.beginPath();
      context.moveTo(0, -12);
      context.lineTo(-8, 0);
      context.lineTo(8, 0);
      context.closePath();
      context.fill();
      context.restore();

      context.save();
      context.translate(x + w * 0.85, y + h * 0.15);
      context.rotate(-earAngle);
      context.beginPath();
      context.moveTo(0, -12);
      context.lineTo(-8, 0);
      context.lineTo(8, 0);
      context.closePath();
      context.fill();
      context.restore();

      // Cat ears with animation (สามเหลี่ยมหงาย)
      context.fillStyle = '#ff9800';
      context.save();
      context.translate(x + w * 0.55, y + h * 0.15);
      context.rotate(earAngle);
      // วาดหูเป็นสามเหลี่ยมหงาย: apex อยู่ที่ (0, -12), ฐานอยู่ระหว่าง (-8,0) ถึง (8,0)
      context.beginPath();
      context.moveTo(0, -12);
      context.lineTo(-8, 0);
      context.lineTo(8, 0);
      context.closePath();
      context.fill();
      context.restore();

      context.save();
      context.translate(x + w * 0.85, y + h * 0.15);
      context.rotate(-earAngle);
      context.beginPath();
      context.moveTo(0, -12);
      context.lineTo(-8, 0);
      context.lineTo(8, 0);
      context.closePath();
      context.fill();
      context.restore();

      // Animated tail
      context.strokeStyle = '#ff9800';
      context.lineWidth = 6;
      context.save();
      context.translate(x + w * 0.1, y + h * 0.6);
      context.rotate(tailAngle);
      context.beginPath();
      context.moveTo(0, 0);
      context.quadraticCurveTo(-20, -15, -35, -5);
      context.stroke();
      context.restore();

      // Cat legs (simple)
      context.fillStyle = '#ff9800';
      const legWidth = w * 0.15;
      const legHeight = h * 0.6;

      // Front legs
      context.fillRect(x + w * 0.3, y + h * 0.6, legWidth, legHeight);
      context.fillRect(x + w * 0.5, y + h * 0.6, legWidth, legHeight);

      // Cat face
      // Eyes
      context.fillStyle = '#4caf50';
      context.beginPath();
      context.ellipse(x + w * 0.6, y + h * 0.25, 3, 4, 0, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.ellipse(x + w * 0.8, y + h * 0.25, 3, 4, 0, 0, Math.PI * 2);
      context.fill();

      // Eye pupils
      context.fillStyle = '#000';
      context.beginPath();
      context.ellipse(x + w * 0.6, y + h * 0.25, 1, 2, 0, 0, Math.PI * 2);
      context.fill();
      context.beginPath();
      context.ellipse(x + w * 0.8, y + h * 0.25, 1, 2, 0, 0, Math.PI * 2);
      context.fill();

      // Nose
      context.fillStyle = '#ff1744';
      context.beginPath();
      context.moveTo(x + w * 0.7, y + h * 0.4);
      context.lineTo(x + w * 0.67, y + h * 0.45);
      context.lineTo(x + w * 0.73, y + h * 0.45);
      context.closePath();
      context.fill();

      // Mouth
      context.strokeStyle = '#000';
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(x + w * 0.7, y + h * 0.45);
      context.quadraticCurveTo(x + w * 0.65, y + h * 0.5, x + w * 0.6, y + h * 0.45);
      context.moveTo(x + w * 0.7, y + h * 0.45);
      context.quadraticCurveTo(x + w * 0.75, y + h * 0.5, x + w * 0.8, y + h * 0.45);
      context.stroke();

      // Whiskers
      context.strokeStyle = '#000';
      context.lineWidth = 1;
      context.beginPath();
      // Left whiskers
      context.moveTo(x + w * 0.45, y + h * 0.35);
      context.lineTo(x + w * 0.25, y + h * 0.3);
      context.moveTo(x + w * 0.45, y + h * 0.4);
      context.lineTo(x + w * 0.25, y + h * 0.4);
      // Right whiskers
      context.moveTo(x + w * 0.95, y + h * 0.35);
      context.lineTo(x + w * 1.15, y + h * 0.3);
      context.moveTo(x + w * 0.95, y + h * 0.4);
      context.lineTo(x + w * 1.15, y + h * 0.4);
      context.stroke();
    }

    function drawObstacle(obs: Obstacle, deltaTime: number) {
      obs.x -= (speed * deltaTime) / 1000;
      const x = obs.x;
      const h = obs.height;
      const w = obs.width;
      const ground = baseGroundY;

      // Dog house obstacle
      context.fillStyle = '#8d6e63';
      context.fillRect(x, ground - h, w, h);

      // Roof
      context.fillStyle = '#5d4037';
      context.beginPath();
      context.moveTo(x - 5, ground - h);
      context.lineTo(x + w / 2, ground - h - 15);
      context.lineTo(x + w + 5, ground - h);
      context.closePath();
      context.fill();

      // Door
      context.fillStyle = '#3e2723';
      context.beginPath();
      context.arc(x + w / 2, ground - h * 0.4, w * 0.3, 0, Math.PI, true);
      context.fill();
    }

    function drawUI() {
      // Score display with cat theme
      context.save();
      context.font = '16px monospace';
      context.textAlign = 'right';
      context.fillStyle = '#7b1fa2';
      context.restore();
    }

    function drawGameOver() {
      context.save();
      context.fillStyle = 'rgba(255, 255, 255, 0.95)';
      context.fillRect(0, 0, baseWidth, baseHeight);

      // Game Over text
      context.fillStyle = '#d32f2f';
      context.font = 'bold 32px sans-serif';
      context.textAlign = 'center';
      context.fillText('GAME OVER', baseWidth / 2, baseHeight / 2 - 30);

      context.font = '16px sans-serif';
      context.fillStyle = '#7b1fa2';
      context.fillText('Press SPACE or CLICK to restart', baseWidth / 2, baseHeight / 2 + 10);
      context.fillText(`Score: ${currentScore}`, baseWidth / 2, baseHeight / 2 + 40);

      context.restore();
    }


    function drawStartScreen() {
      drawBackground(16);
      clouds.forEach((cloud) => drawCloud(cloud, 16));
      drawCat(0);

      context.save();
      context.fillStyle = '#7b1fa2';
      context.font = 'bold 28px sans-serif';
      context.textAlign = 'center';
      context.fillText('🐱 CAT RUN 🐱', baseWidth / 2, baseHeight / 2 - 30);

      context.fillStyle = '#9c27b0';
      context.font = '16px sans-serif';
      context.fillText('Press SPACE or CLICK to start', baseWidth / 2, baseHeight / 2 + 10);

      context.restore();
    }

    function gameLoop(timestamp: number) {
      if (!isRunning || showPauseMenu) return;

      if (!gameStartTimestamp) {
        gameStartTimestamp = timestamp;
        lastTime = timestamp;
      }
      const deltaTime = timestamp - lastTime;
      lastTime = timestamp;

      context.clearRect(0, 0, baseWidth, baseHeight);

      drawBackground(deltaTime);
      clouds.forEach((cloud) => drawCloud(cloud, deltaTime));
      drawCat(deltaTime);

      updateParticles(deltaTime);
      drawParticles();

      obstacleTimer += deltaTime;
      if (obstacleTimer > nextObstacleDelay) {
        const h = 30 + Math.random() * 50;
        obstacles.push({
          x: baseWidth,
          width: 15,
          height: h,
          spawnTimestamp: timestamp,
        });
        obstacleTimer = 0;
        nextObstacleDelay = randomDelay();
      }


      obstacles.forEach((obs, idx) => {
        drawObstacle(obs, deltaTime);

        // Collision detection
        const catRect = {
          x: cat.x + 5,
          y: baseGroundY - cat.height + cat.y + 5,
          width: cat.width - 10,
          height: cat.height - 10,
        };
        const obsRect = {
          x: obs.x,
          y: baseGroundY - obs.height,
          width: obs.width,
          height: obs.height,
        };

        if (
          catRect.x < obsRect.x + obsRect.width &&
          catRect.x + catRect.width > obsRect.x &&
          catRect.y < obsRect.y + obsRect.height &&
          catRect.y + catRect.height > obsRect.y
        ) {
          createParticles(obs.x + obs.width / 2, obsRect.y + obs.height / 2, '#ff5722');
          setIsGameOver(true);
          setIsRunning(false);
        }

        if (obs.x + obs.width < 0) {
          obstacles.splice(idx, 1);
          setCurrentScore(prev => prev + 1);
        }

      });

      // Dynamic speed increase
      const elapsed = timestamp - gameStartTimestamp;
      speed = (200 + Math.floor(elapsed / 5000) * 25) * gameSpeed;

      drawUI();

      if (!isGameOver) {
        animationId = requestAnimationFrame(gameLoop);
      } else {
        drawGameOver();
      }
    }

    resetGame();
    drawStartScreen();

    if (isRunning && !showPauseMenu) {
      animationId = requestAnimationFrame(gameLoop);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('mousedown', handleMouseDown);
      cancelAnimationFrame(animationId);
    };
  }, [isRunning, isGameOver, showPauseMenu, gameSpeed]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-pink-300 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-purple-300 rounded-full blur-lg animate-bounce delay-1000"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-300 rounded-full blur-xl animate-pulse delay-500"></div>
        <div className="absolute bottom-32 right-1/3 w-12 h-12 bg-pink-400 rounded-full blur-lg animate-bounce delay-700"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Minimal Header */}
        <div className="mb-4 sm:mb-6 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-800 bg-clip-text text-transparent flex items-center justify-center gap-2 sm:gap-3">
            <Heart className="w-5 h-5 sm:w-7 sm:h-7 text-pink-500 animate-bounce" />
            Cat Run
            <Star className="w-5 h-5 sm:w-7 sm:h-7 text-purple-500 animate-bounce delay-200" />
          </h1>
        </div>

        {/* Score Display */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-gradient-to-r from-pink-300 to-purple-400 text-white px-6 py-4 rounded-3xl shadow-xl text-center">
            <div className="flex items-center justify-center gap-3 text-xl sm:text-2xl font-bold font-mono">
              <Zap className="w-6 h-6 text-white animate-pulse" />
              Score: {currentScore.toString().padStart(5, '0')}
            </div>
          </div>
        </div>

        {/* Game Canvas Container */}
        <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-2 border-purple-200 max-w-full">
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={240}
              className="block w-full max-w-[800px] h-auto"
              style={{ aspectRatio: '800/240' }}
            />

            {/* Enhanced Pause Menu */}
            {showPauseMenu && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center bg-white/90 rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-200">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Pause className="w-6 h-6 text-purple-600" />
                    <h2 className="text-2xl sm:text-3xl font-bold text-purple-800">Game Paused</h2>
                  </div>
                  <p className="text-purple-600 mb-6 text-sm sm:text-base">Take a breath and continue when ready!</p>
                  <button
                    onClick={() => {
                      setShowPauseMenu(false);
                      setIsRunning(true);
                    }}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 sm:px-8 py-3 rounded-2xl transition-all duration-300 font-semibold flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Play className="w-5 h-5" />
                    Resume Game
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Controls */}
        <div className="mt-6 sm:mt-8 flex flex-col items-center w-full max-w-3xl px-4 sm:px-0">
          <div className="bg-white/60 backdrop-blur-md rounded-xl px-4 py-2 shadow-sm border border-gray-200 text-center w-full">
            <p className="text-gray-700 text-sm sm:text-base font-medium tracking-tight">
              Press <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs border">SPACE</kbd> or <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs border">CLICK</kbd> to jump &bull; <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs border">ESC</kbd> to pause
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;