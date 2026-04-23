/**
 * Utility to export a board state to Markdown format for Server-side (MCP) use.
 */
const boardToMarkdown = (board, baseUrl = '') => {
  let md = `# ${board.name}\n\n`;

  if (!board.columns || board.columns.length === 0) {
    md += "_No columns in this board._\n";
    return md;
  }

  board.columns.forEach((column) => {
    md += `## ${column.title}\n\n`;

    if (!column.cards || column.cards.length === 0) {
      md += "_No cards in this column._\n\n";
    } else {
      column.cards.forEach((card) => {
        md += `### ${card.content}\n`;
        
        if (card.author) {
          md += `*By: ${card.author}*\n`;
        }

        if (card.image_url) {
          const fullImageUrl = card.image_url.startsWith('http') 
            ? card.image_url 
            : `${baseUrl}${card.image_url}`;
          md += `![Card Image](${fullImageUrl})\n`;
        }

        // Reactions
        if (card.reactions && card.reactions.length > 0) {
          const reactionStr = card.reactions
            .map((r) => `${r.emoji} x${r.count}`)
            .join(", ");
          md += `*Reactions: ${reactionStr}*\n`;
        }

        // Replies
        if (card.replies && card.replies.length > 0) {
          card.replies.forEach((reply) => {
            const replyAuthor = reply.author ? `${reply.author}: ` : "";
            md += `> ${replyAuthor}${reply.content}\n`;
            if (reply.image_url) {
              const fullReplyImageUrl = reply.image_url.startsWith('http')
                ? reply.image_url
                : `${baseUrl}${reply.image_url}`;
              md += `> ![Reply Image](${fullReplyImageUrl})\n`;
            }
          });
        }

        md += `\n`; 
      });
    }
  });

  return md;
};

module.exports = { boardToMarkdown };
