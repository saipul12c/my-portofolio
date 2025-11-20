/**
 * Utility untuk memetakan bahasa/teknologi ke halaman dan resource terkait
 */

export const skillRouteMap = {
  // Bahasa Sehari-hari
  "Indonesia": {
    relatedPages: ["/about", "/blog"],
    category: "language",
    resourceLinks: {
      documentation: null,
      tutorial: null,
      community: null
    }
  },
  "English": {
    relatedPages: ["/projects", "/blog"],
    category: "language",
    resourceLinks: {
      documentation: "https://www.britannica.com/topic/English-language",
      tutorial: null,
      community: null
    }
  },
  "Jawa": {
    relatedPages: ["/about", "/testimoni"],
    category: "language",
    resourceLinks: {
      documentation: null,
      tutorial: null,
      community: null
    }
  },
  "Japan": {
    relatedPages: ["/blog", "/hobbies"],
    category: "language",
    resourceLinks: {
      documentation: "https://www.japantimes.co.jp",
      tutorial: "https://www.duolingo.com/learn/ja",
      community: null
    }
  },

  // Teknologi & Pemrograman
  "JavaScript": {
    relatedPages: ["/projects", "/blog"],
    category: "programming",
    resourceLinks: {
      documentation: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
      tutorial: "https://javascript.info/",
      community: "https://stackoverflow.com/questions/tagged/javascript"
    }
  },
  "Python": {
    relatedPages: ["/projects", "/blog"],
    category: "programming",
    resourceLinks: {
      documentation: "https://docs.python.org/",
      tutorial: "https://www.python.org/about/gettingstarted/",
      community: "https://stackoverflow.com/questions/tagged/python"
    }
  },
  "React": {
    relatedPages: ["/projects", "/blog"],
    category: "programming",
    resourceLinks: {
      documentation: "https://react.dev",
      tutorial: "https://react.dev/learn",
      community: "https://stackoverflow.com/questions/tagged/reactjs"
    }
  },
  "Java": {
    relatedPages: ["/projects", "/blog"],
    category: "programming",
    resourceLinks: {
      documentation: "https://docs.oracle.com/javase/",
      tutorial: "https://www.oracle.com/java/technologies/javase/",
      community: "https://stackoverflow.com/questions/tagged/java"
    }
  },
  "PHP": {
    relatedPages: ["/projects", "/blog"],
    category: "programming",
    resourceLinks: {
      documentation: "https://www.php.net/manual/",
      tutorial: "https://www.php.net/manual/en/getting-started.php",
      community: "https://stackoverflow.com/questions/tagged/php"
    }
  },
  "SQL": {
    relatedPages: ["/projects"],
    category: "database",
    resourceLinks: {
      documentation: "https://www.w3schools.com/sql/",
      tutorial: "https://sqlzoo.net/",
      community: "https://stackoverflow.com/questions/tagged/sql"
    }
  }
};

/**
 * Ambil mapping untuk skill tertentu
 */
export const getSkillMapping = (skillName) => {
  return skillRouteMap[skillName] || {
    relatedPages: ["/projects", "/blog"],
    category: "general",
    resourceLinks: {
      documentation: null,
      tutorial: null,
      community: null
    }
  };
};

/**
 * Buat link untuk external resources
 */
export const getResourceLink = (skillName, resourceType) => {
  const mapping = getSkillMapping(skillName);
  return mapping.resourceLinks[resourceType] || null;
};
