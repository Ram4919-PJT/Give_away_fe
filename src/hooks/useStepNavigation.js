import { useCallback, useState } from 'react';

/**
 * Step index navigation with forward/back direction for panel transitions.
 */
export function useStepNavigation(initialStep = 1, { min = 1, max } = {}) {
  const [step, setStepState] = useState(initialStep);
  const [direction, setDirection] = useState('forward');

  const goToStep = useCallback((target) => {
    setStepState((current) => {
      const next = typeof target === 'function' ? target(current) : target;
      setDirection(next < current ? 'back' : 'forward');
      if (max != null) return Math.min(max, Math.max(min, next));
      return Math.max(min, next);
    });
  }, [min, max]);

  const goNext = useCallback(() => {
    setDirection('forward');
    setStepState((current) => (max != null ? Math.min(max, current + 1) : current + 1));
  }, [max]);

  const goBack = useCallback(() => {
    setDirection('back');
    setStepState((current) => Math.max(min, current - 1));
  }, [min]);

  const resetStep = useCallback((nextStep = initialStep) => {
    setDirection('back');
    setStepState(nextStep);
  }, [initialStep]);

  return {
    step,
    direction,
    goToStep,
    goNext,
    goBack,
    resetStep,
    setDirection,
  };
}
