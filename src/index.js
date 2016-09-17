import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';

export default async function(root, request) {
  let filePath, fileStats;

  try {
    filePath = root.path('src', request.path);

    if (!root.contains(filePath)) {
      return null;
    }

    fileStats = await root.stat(filePath);

    if (fileStats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
      fileStats = await root.stat(filePath);
    }

    return {
      path: filePath,
      type: path.extname(filePath),
      stats: fileStats,
      stream: () => fs.createReadStream(filePath)
    };
  } catch (error) {
    return null;
  }
}
