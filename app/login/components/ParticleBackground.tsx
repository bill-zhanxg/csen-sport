'use client';
import { useEffect, useState } from 'react';

interface Particle {
	id: number;
	x: number;
	y: number;
	vx: number;
	vy: number;
}

interface Triangle {
	p1: Particle;
	p2: Particle;
	p3: Particle;
	center: { x: number; y: number };
	area: number;
}

export function ParticleBackground() {
	const [particles, setParticles] = useState<Particle[]>([]);
	const [triangles, setTriangles] = useState<Triangle[]>([]);
	const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

	// Initialize particles
	useEffect(() => {
		const updateDimensions = () => {
			setDimensions({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		updateDimensions();
		window.addEventListener('resize', updateDimensions);

		// Track mouse movement
		const handleMouseMove = (e: MouseEvent) => {
			setMousePos({ x: e.clientX, y: e.clientY });
		};

		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('resize', updateDimensions);
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	// Initialize particles after dimensions are set
	useEffect(() => {
		if (dimensions.width === 0 || dimensions.height === 0) return;

		// Create initial particles
		const initialParticles: Particle[] = [];
		const particleCount = 25;

		// Create a grid-like distribution with some randomness
		const cols = Math.ceil(Math.sqrt(particleCount));
		const rows = Math.ceil(particleCount / cols);
		const cellWidth = dimensions.width / cols;
		const cellHeight = dimensions.height / rows;

		for (let i = 0; i < particleCount; i++) {
			const col = i % cols;
			const row = Math.floor(i / cols);

			// Base position in grid cell
			const baseX = (col + 0.5) * cellWidth;
			const baseY = (row + 0.5) * cellHeight;

			// Add randomness within the cell (±40% of cell size)
			const randomOffsetX = (Math.random() - 0.5) * cellWidth * 0.8;
			const randomOffsetY = (Math.random() - 0.5) * cellHeight * 0.8;

			initialParticles.push({
				id: i,
				x: Math.max(50, Math.min(dimensions.width - 50, baseX + randomOffsetX)),
				y: Math.max(50, Math.min(dimensions.height - 50, baseY + randomOffsetY)),
				vx: (Math.random() - 0.5) * 0.5,
				vy: (Math.random() - 0.5) * 0.5,
			});
		}

		// eslint-disable-next-line react-hooks/set-state-in-effect
		setParticles(initialParticles);
	}, [dimensions]);

	// Animation loop
	useEffect(() => {
		let animationId: number;

		const animate = () => {
			setParticles((prevParticles) => {
				const newParticles = prevParticles.map((particle) => {
					let newX = particle.x + particle.vx;
					let newY = particle.y + particle.vy;
					let newVx = particle.vx;
					let newVy = particle.vy;

					// Calculate distance to mouse cursor
					const distanceToMouse = Math.sqrt(Math.pow(newX - mousePos.x, 2) + Math.pow(newY - mousePos.y, 2));

					// If within influence radius, apply repulsion force
					const influenceRadius = 100;
					if (distanceToMouse < influenceRadius && distanceToMouse > 0) {
						const force = (influenceRadius - distanceToMouse) / influenceRadius;
						const angle = Math.atan2(newY - mousePos.y, newX - mousePos.x);

						// Apply repulsion force
						const repulsionStrength = 2;
						newVx += Math.cos(angle) * force * repulsionStrength;
						newVy += Math.sin(angle) * force * repulsionStrength;

						// Limit velocity to prevent particles from moving too fast
						const maxVelocity = 3;
						const currentSpeed = Math.sqrt(newVx * newVx + newVy * newVy);
						if (currentSpeed > maxVelocity) {
							newVx = (newVx / currentSpeed) * maxVelocity;
							newVy = (newVy / currentSpeed) * maxVelocity;
						}
					}

					// Apply friction to gradually slow down particles
					newVx *= 0.98;
					newVy *= 0.98;

					// Keep minimum movement for natural floating
					const minVelocity = 0.1;
					if (Math.abs(newVx) < minVelocity) {
						newVx += (Math.random() - 0.5) * 0.1;
					}
					if (Math.abs(newVy) < minVelocity) {
						newVy += (Math.random() - 0.5) * 0.1;
					}

					newX += newVx;
					newY += newVy;

					// Bounce off walls
					if (newX <= 0 || newX >= dimensions.width) {
						newVx = -newVx;
						newX = Math.max(0, Math.min(dimensions.width, newX));
					}
					if (newY <= 0 || newY >= dimensions.height) {
						newVy = -newVy;
						newY = Math.max(0, Math.min(dimensions.height, newY));
					}

					return {
						...particle,
						x: newX,
						y: newY,
						vx: newVx,
						vy: newVy,
					};
				});

				// Calculate triangles from nearby particles (limit to first 30 for performance)
				const newTriangles: Triangle[] = [];
				const maxDistance = 150;
				const maxTriangles = 30;

				for (let i = 0; i < newParticles.length && newTriangles.length < maxTriangles; i++) {
					for (let j = i + 1; j < newParticles.length && newTriangles.length < maxTriangles; j++) {
						for (let k = j + 1; k < newParticles.length && newTriangles.length < maxTriangles; k++) {
							const p1 = newParticles[i];
							const p2 = newParticles[j];
							const p3 = newParticles[k];

							// Calculate distances between all three points
							const d1 = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
							const d2 = Math.sqrt(Math.pow(p2.x - p3.x, 2) + Math.pow(p2.y - p3.y, 2));
							const d3 = Math.sqrt(Math.pow(p3.x - p1.x, 2) + Math.pow(p3.y - p1.y, 2));

							// Only create triangle if all distances are within max range
							if (d1 < maxDistance && d2 < maxDistance && d3 < maxDistance) {
								// Calculate triangle area (simplified)
								const area = Math.abs((p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y)) / 2);

								// Only add triangles that aren't too small or too large
								if (area > 1000 && area < 10000) {
									newTriangles.push({
										p1,
										p2,
										p3,
										center: { x: (p1.x + p2.x + p3.x) / 3, y: (p1.y + p2.y + p3.y) / 3 },
										area,
									});
								}
							}
						}
					}
				}

				setTriangles(newTriangles);
				return newParticles;
			});

			animationId = requestAnimationFrame(animate);
		};

		animationId = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(animationId);
	}, [dimensions, mousePos]);

	return (
		<div className="absolute inset-0 overflow-hidden pointer-events-none">
			{/* GPU-accelerated SVG layer */}
			<div
				className="absolute inset-0"
				style={{
					transform: 'translateZ(0)', // Force GPU layer
					willChange: 'transform',
				}}
			>
				<svg
					width={dimensions.width}
					height={dimensions.height}
					className="absolute inset-0"
					style={{
						transform: 'translateZ(0)', // Force GPU layer
						willChange: 'contents',
					}}
				>
					{/* Render triangles */}
					{triangles.slice(0, 20).map((triangle, index) => {
						// Calculate opacity based on triangle area (smaller triangles are more opaque)
						const opacity = Math.max(0.05, Math.min(0.2, 1500 / triangle.area));

						return (
							<polygon
								key={`triangle-${index}`}
								points={`${triangle.p1.x},${triangle.p1.y} ${triangle.p2.x},${triangle.p2.y} ${triangle.p3.x},${triangle.p3.y}`}
								fill="currentColor"
								className="text-primary/20"
								style={{
									opacity,
									transform: 'translateZ(0)', // GPU acceleration
									willChange: 'opacity',
								}}
							/>
						);
					})}

					{/* Render triangle edges with different styling */}
					{triangles.slice(0, 15).map((triangle, index) => (
						<g key={`edges-${index}`} style={{ transform: 'translateZ(0)' }}>
							<line
								x1={triangle.p1.x}
								y1={triangle.p1.y}
								x2={triangle.p2.x}
								y2={triangle.p2.y}
								stroke="currentColor"
								strokeWidth="0.5"
								className="text-secondary/20"
								opacity={0.4}
								style={{ willChange: 'auto' }}
							/>
							<line
								x1={triangle.p2.x}
								y1={triangle.p2.y}
								x2={triangle.p3.x}
								y2={triangle.p3.y}
								stroke="currentColor"
								strokeWidth="0.5"
								className="text-secondary/20"
								opacity={0.4}
								style={{ willChange: 'auto' }}
							/>
							<line
								x1={triangle.p3.x}
								y1={triangle.p3.y}
								x2={triangle.p1.x}
								y2={triangle.p1.y}
								stroke="currentColor"
								strokeWidth="0.5"
								className="text-secondary/20"
								opacity={0.4}
								style={{ willChange: 'auto' }}
							/>
						</g>
					))}
				</svg>
			</div>

			{/* GPU-accelerated particles layer */}
			<div
				className="absolute inset-0"
				style={{
					transform: 'translateZ(0)', // Force GPU layer
					willChange: 'transform',
				}}
			>
				{/* Render particles */}
				{particles.map((particle) => (
					<div
						key={particle.id}
						className="absolute w-2 h-2 bg-primary/30 rounded-full"
						style={{
							transform: `translate3d(${particle.x - 4}px, ${particle.y - 4}px, 0) scale(1.1)`,
							willChange: 'transform',
							transition: 'transform 0.1s linear',
						}}
					/>
				))}
			</div>
		</div>
	);
}
