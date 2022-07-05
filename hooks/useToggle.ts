import { useState, Dispatch, SetStateAction } from 'react';

interface UseToggleOutPut {
  toggle: () => void;
  checked: boolean;
  setChecked: Dispatch<SetStateAction<boolean>>;
  onClose: () => void;
  onOpen: () => void;
}

function useToggle(defaultChecked: boolean): UseToggleOutPut {
  const [checked, setChecked] = useState<boolean>(defaultChecked || false);

  const toggle = () => setChecked(!checked);

  const onOpen = () => {
    setChecked(true);
  };

  const onClose = () => {
    setChecked(false);
  };

  return { toggle, checked, setChecked, onClose, onOpen };
}

export default useToggle;
