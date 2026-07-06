import { useState, useEffect } from 'react';

interface UseKeyPressReturn {
  pressedKeys: Set<string>;
  isKeyPressed: (key: string) => boolean;
}

export function useKeyPress(): UseKeyPressReturn {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      setPressedKeys((prev) => new Set(prev).add(event.key));
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      setPressedKeys((prev) => {
        const next = new Set(prev);
        next.delete(event.key);
        return next;
      });
    };

    const handleBlur = () => {
      setPressedKeys(new Set());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const isKeyPressed = (key: string) => pressedKeys.has(key);

  return { pressedKeys, isKeyPressed };
}
