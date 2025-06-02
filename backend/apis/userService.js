const users = {
  1: { id: 1, name: "Alice", email: "alice@example.com" },
  2: { id: 2, name: "Bob", email: "bob@example.com" },
  3: { id: 3, name: "Charlie", email: "charlie@example.com" },
  4: { id: 4, name: "Diana", email: "diana@example.com" },
  5: { id: 5, name: "Ethan", email: "ethan@example.com" },
};

export const userService = {
  getUserProfile: (id) => {
    if (users[id]) {
      return users[id]
    } else {
      return { success: false, error: "User not found" };
    }
  },

  getUserEmail: (id) => {
    if (users[id]) {
      return { success: true, data: users[id].email };
    } else {
      return { success: false, error: "User not found" };
    }
  },

  meta: {
    getUserProfile: {
      params: [
        {
          name: "id",
          type: "number",
        },
      ],
    },
    getUserEmail: {
      params: [
        {
          name: "id",
          type: "number",
        },
      ],
    },
  },
};
