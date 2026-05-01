
export async function printGrid(url: string): Promise<void> {
  try {
    // Use a CORS proxy to bypass CORS restrictions
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const proxiedUrl = proxyUrl + url;
    const response = await fetch(proxiedUrl);
    console.log(`Fetching data from: ${proxiedUrl}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Find the table containing the data
    const table = doc.querySelector('table');
    console.log(table);
    if (!table) {
      console.log('No table found in the document');
      return;
    }

    const rows = table.querySelectorAll('tr');
    const data: { x: number; y: number; char: string }[] = [];

    // Assume the first row is header, start from index 1
    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll('td');
      if (cells.length >= 3) {
        // Extract text from td > p > span structure
        const getTextFromCell = (cell: Element): string => {
          const span = cell.querySelector('p span');
          if (span) {
            return span.textContent?.trim() || '';
          }
          return cell.textContent?.trim() || '';
        };
        
        const xText = getTextFromCell(cells[0]);
        const yText = getTextFromCell(cells[2]);
        const charText = getTextFromCell(cells[1]);
        

        const x = parseInt(xText || '0', 10);
        const y = parseInt(yText || '0', 10);
        const char = charText || ' ';
        
    console.log(x, y, char);

        if (!isNaN(x) && !isNaN(y)) {
          data.push({ x, y, char });
        }
      }
    }

    if (data.length === 0) {
      console.log('No valid data found in the table');
      return;
    }

    // Find max x and y
    let maxX = 0;
    let maxY = 0;
    for (const item of data) {
      if (item.x > maxX) maxX = item.x;
      if (item.y > maxY) maxY = item.y;
    }

    // Create grid filled with spaces
    const grid: string[][] = [];
    for (let y = 0; y <= maxY; y++) {
      grid[y] = new Array(maxX + 1).fill(' ');
    }

    // Place characters in the grid
    for (const item of data) {
      grid[item.y][item.x] = item.char;
    }

    // Print the grid
    for (const row of grid) {
      console.log(row.join(''));
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Example usage (replace with actual URL)
// printGrid('http://docs.google.com/document/d/e/2PACX-1vSvM5gDlNvt7npYHhp_XfsJvuntUhq184By5xO_pA4b_gCWeXb6dM6ZxwN8rE6S4ghUsCj2VKR21oEP/pub');