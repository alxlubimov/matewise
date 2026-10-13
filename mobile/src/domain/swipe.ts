export type SwipeDecision = 'interest' | 'skip';
export function decideSwipe(dx: number, dy: number, velocity: number, width: number): SwipeDecision | null {
  if (Math.abs(dx) <= Math.abs(dy) * 1.2) return null;
  const threshold = Math.min(120, Math.max(72, width * .28));
  const farEnough = Math.abs(dx) >= threshold;
  const quickFlick = Math.abs(dx) >= 35 && Math.abs(velocity) >= .65 && Math.sign(dx) === Math.sign(velocity);
  return farEnough || quickFlick ? dx > 0 ? 'interest' : 'skip' : null;
}
