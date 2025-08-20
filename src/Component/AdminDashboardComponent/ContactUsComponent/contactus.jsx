import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MessagesList = () => {
  const [messages, setMessages] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch messages from backend
  useEffect(() => {
    fetch("/api/messages")
      .then((res) => res.json())
      .then((data) => {
        // Sort messages by date (latest first)
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setMessages(sorted);
      })
      .catch((err) => console.error("Error fetching messages:", err));
  }, []);

  // Search filter
  const filteredMessages = messages.filter((msg) => {
    const searchText = search.toLowerCase();
    return (
      msg.name.toLowerCase().includes(searchText) ||
      msg.email.toLowerCase().includes(searchText) ||
      msg.subject.toLowerCase().includes(searchText) ||
      msg.message.toLowerCase().includes(searchText) ||
      (msg.date && new Date(msg.date).toLocaleString().includes(searchText))
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentMessages = filteredMessages.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="p-6">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by name, email, subject, date, message..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="mb-4 p-2 border rounded w-full"
      />

      {/* Messages List */}
      <div className="grid gap-4">
        {currentMessages.length > 0 ? (
          currentMessages.map((msg) => (
            <Card
              key={msg._id}
              className="cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedMessage(msg)}
            >
              <CardContent className="p-4">
                <h2 className="text-lg font-semibold">{msg.subject}</h2>
                <p className="text-sm text-gray-600">
                  {msg.name} • {msg.email}
                </p>
                <p className="text-gray-700 truncate">{msg.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg.date).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-gray-500">No messages found.</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Modal Popup */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
            <button
              onClick={() => setSelectedMessage(null)}
              className="absolute top-2 right-2 text-gray-600"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-2">
              {selectedMessage.subject}
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              {selectedMessage.name} • {selectedMessage.email}
            </p>
            <p className="mb-4">{selectedMessage.message}</p>
            <p className="text-xs text-gray-500">
              {new Date(selectedMessage.date).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesList;
