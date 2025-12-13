export function getFileIcon(extension) {
  const icons = {
    'pdf': '📄',
    'doc': '📝',
    'docx': '📝',
    'txt': '📃',
    'xls': '📊',
    'xlsx': '📊',
    'csv': '📈',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'png': '🖼️',
    'json': '⚙️',
    'md': '📋'
  };
  return icons[extension] || '📁';
}
