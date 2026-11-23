import { useState, useEffect } from 'react';
import config from '../../../data/comingsoon/data.json';

export const findComingSoonProject = (slugOrId, list = config) => {
  if (!slugOrId) return list[0];
  const query = String(slugOrId).toLowerCase().trim();
  return (
    list.find(
      (item) =>
        (item.slug && item.slug.toLowerCase() === query) ||
        String(item.id) === query ||
        (item.brand?.name && item.brand.name.toLowerCase().replace(/\s+/g, '-') === query) ||
        (item.liveUrl && item.liveUrl.replace(/^\//, '').toLowerCase() === query)
    ) || list[0]
  );
};

const useConfig = (initialSlug) => {
  const [currentConfig, setCurrentConfig] = useState(() => findComingSoonProject(initialSlug));

  useEffect(() => {
    if (initialSlug) {
      setCurrentConfig(findComingSoonProject(initialSlug));
    }
  }, [initialSlug]);

  const handleConfigChange = (configId) => {
    const selectedConfig = config.find(item => item.id === configId);
    if (selectedConfig) {
      setCurrentConfig(selectedConfig);
    }
  };

  return {
    currentConfig,
    setCurrentConfig,
    handleConfigChange,
    configList: config
  };
};

export default useConfig;
