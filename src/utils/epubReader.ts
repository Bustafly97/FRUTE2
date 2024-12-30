export async function extractTextFromEpub(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const book = new window.ePub(arrayBuffer);
    await book.ready;
    
    const chapters = await Promise.all(
      book.spine.spineItems.map(async (section) => {
        try {
          const contents = await section.load();
          const doc = new DOMParser().parseFromString(contents, 'text/html');
          return extractTextFromNode(doc.body);
        } catch (err) {
          console.error('Error loading chapter:', err);
          return '';
        }
      })
    );

    return cleanText(chapters.join('\n\n'));
  } catch (err) {
    console.error('Error processing EPUB:', err);
    throw new Error('Failed to process EPUB file');
  }
}

function extractTextFromNode(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent?.trim() || '';
  }

  const childTexts: string[] = [];
  node.childNodes.forEach((child) => {
    const text = extractTextFromNode(child);
    if (text) {
      childTexts.push(text);
    }
  });

  // Add line breaks after block elements
  const nodeName = node.nodeName.toLowerCase();
  if (['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'br'].includes(nodeName)) {
    childTexts.push('\n');
  }

  return childTexts.join(' ');
}

function cleanText(text: string): string {
  return text
    .replace(/\n{3,}/g, '\n\n')  // Reduce multiple line breaks
    .replace(/\s{2,}/g, ' ')     // Reduce multiple spaces
    .replace(/\t/g, ' ')         // Replace tabs
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .join('\n')
    .trim();
}