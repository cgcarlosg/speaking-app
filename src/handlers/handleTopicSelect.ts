export function handleTopicSelect(
  topic: 'general' | 'development',
  setSelectedTopic: (value: 'general' | 'development') => void,
  setRespuestaLabel: (value: string) => void
) {
  setSelectedTopic(topic);
  setRespuestaLabel(topic === 'development' ? 'Tema de desarrollo' : 'Tema general');
}
