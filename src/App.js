import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [initialItems, setInitialItems] = useState([]);

  return (
    <div className="app">
      <Logo />
      <Form initialItems={initialItems} setInitialItems={setInitialItems} />
      <PackingList
        initialItems={initialItems}
        setInitialItems={setInitialItems}
      />
      <Stats initialItems={initialItems} />
    </div>
  );
}

function Logo() {
  return <h1>🌴 Travel Diary 💼</h1>;
}

function Form({ initialItems, setInitialItems }) {
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  const submitHandler = (e) => {
    e.preventDefault();

    if (description) {
      setInitialItems((prev) => [
        ...prev,
        {
          id: initialItems.length + 1,
          description,
          quantity,
          packed: false,
        },
      ]);
    }

    setDescription("");
    setQuantity(1);
  };

  return (
    <form className="add-form" onSubmit={submitHandler}>
      <h3>What do you need for your trip 😊?</h3>

      <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
        {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
          <option value={num} key={num}>
            {num}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Item..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}

function PackingList({ initialItems, setInitialItems }) {
  const [sortBy, setSortBy] = useState("input");
  let sortedItems;

  if (sortBy === "input") sortedItems = initialItems;
  if (sortBy === "description")
    sortedItems = initialItems
      .slice()
      .sort((a, b) => a.description.localeCompare(b.description));
  if (sortBy === "packed")
    sortedItems = initialItems
      .slice()
      .sort((a, b) => Number(a.packed) - Number(b.packed));
  if (sortBy === "quantity")
    sortedItems = initialItems
      .slice()
      .sort((a, b) => Number(a.quantity) - Number(b.quantity));

  const handleClear = () => {
    const confirmed = window.confirm(
      "You are about to delete all items. Click OK to continue or CANCEL to revoke action."
    );

    if (!confirmed) return;
    setInitialItems([]);
    initialItems.length
      ? (document.querySelector(".actions").style.display = "block")
      : (document.querySelector(".actions").style.display = "none");
  };

  return (
    <div className="list">
      <ul>
        {sortedItems.map((item) => (
          <Item key={item.id} item={item} setInitialItems={setInitialItems} />
        ))}
      </ul>
      {!initialItems.length ? (
        <div></div>
      ) : (
        <div className="actions">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="input">Sort by input order</option>
            <option value="description">Sort by description</option>
            <option value="packed">Sort by packed status</option>
            <option value="quantity">Sort by quantity</option>
          </select>

          <button onClick={handleClear}>Clear List</button>
        </div>
      )}
    </div>
  );
}

function Item({ item, setInitialItems }) {
  const handlePackedItems = (id) => {
    setInitialItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  };

  const removeItemHandler = (id) => {
    setInitialItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <li key={item.id}>
      <input
        type="checkbox"
        value={item.packed}
        onChange={() => handlePackedItems(item.id)}
      />
      <span style={item.packed ? { textDecoration: "line-through" } : {}}>
        {item.quantity} {item.description}
      </span>
      <button onClick={() => removeItemHandler(item.id)}>❌</button>
    </li>
  );
}

function Stats({ initialItems }) {
  if (!initialItems.length)
    return <p className="stats">Start adding some items to your list 🚀</p>;

  const numItems = initialItems.length;
  const numItemsPacked = initialItems.filter((item) => item.packed).length;
  const percentagePacked = Math.ceil((numItemsPacked / numItems) * 100);

  return (
    <footer className="stats">
      <em>
        {percentagePacked === 100
          ? `You got everything! Ready to go ✈️`
          : `💼 You have ${numItems} items on your list, and you already packed
        ${numItemsPacked} (${numItems !== 0 ? percentagePacked : 0}%)`}
      </em>
    </footer>
  );
}
