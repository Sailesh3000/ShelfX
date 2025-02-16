import { EntityTypesClient } from '@google-cloud/dialogflow';
import { db } from '../index.js';

const DIALOGFLOW_PROJECT_ID = 'shelf-chatbot-for-book-re-uuin';
const LOCATION = 'global';  // or your specific location
const BOOKS_ENTITY_TYPE = 'book-item';  // your entity type name

export const syncBooksWithDialogflow = async () => {
  try {
    // 1. Get books from database
    const books = await new Promise((resolve, reject) => {
      db.query("SELECT bookName FROM books", (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });

    // 2. Format books for Dialogflow entity
    const entityValues = books.map(book => {
      const synonyms = [
        book.bookName,                          // Original name
        `${book.bookName} book`,               // Name + "book"
        `${book.bookName} novel`,              // Name + "novel"
        book.bookName.toLowerCase(),            // Lowercase version
        `${book.bookName.toLowerCase()} book`   // Lowercase + "book"
      ];

      const uniqueSynonyms = [...new Set(synonyms.filter(s => s))];

      return {
        value: book.bookName,
        synonyms: uniqueSynonyms
      };
    });

    const client = new EntityTypesClient();
    const entityTypePath = client.entityTypePath(
      DIALOGFLOW_PROJECT_ID,
      LOCATION,
      BOOKS_ENTITY_TYPE
    );

    const request = {
      name: entityTypePath,
      entityType: {
        entities: entityValues,
        kind: 'KIND_MAP'
      }
    };

    await client.updateEntityType(request);
    console.log('Successfully synced books with Dialogflow');
    
    return true;
  } catch (error) {
    console.error('Error syncing books with Dialogflow:', error);
    throw error;
  }
};