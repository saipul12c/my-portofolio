import { useState } from 'react';
import config from '../../../data/comingsoon/data.json';

const useConfig = () => {
  const [currentConfig, setCurrentConfig] = useState(config[0]);

  const handleConfigChange = (configId) => {
    const selectedConfig = config.find(item => item.id === configId);
    setCurrentConfig(selectedConfig);
  };

  return {
    currentConfig,
    handleConfigChange,
    configList: config
  };
};

export default useConfig;