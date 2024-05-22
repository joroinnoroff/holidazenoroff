import { SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import Modal from "./modal";

export default function FilterVenues({ venues, setVenues }) {
  const [isActive, setIsActive] = useState(false);
  const [filteredVenues, setFilteredVenues] = useState([]);
  const FilteringModal = {
    open: {
      width: "100%",
      height: "100%",
      backgroundColor: "#FFF",
      top: "10px",
      left: "5px",
      zIndex: 10, // "zIndex" should be in camelCase
      transition: { duration: 0.75, type: "tween", ease: [0.76, 0, 0.24, 1] }
    },
    closed: {
      width: "100px",
      height: "40px",
      top: "260px",
      left: "90%",
      transition: { duration: 0.75, delay: 0.35, type: "tween", ease: [0.76, 0, 0.24, 1] }
    }
  };

  return (
    <motion.div
      variants={FilteringModal}
      animate={isActive ? 'open' : 'closed'} // fixed typo here
      initial="closed"
      className="absolute top-0 left-0"
    >
      {isActive ? (
        <button
          className="py-3 px-3 border w-50 mb-3 flex rounded-full gap-2"
          onClick={() => setIsActive(!isActive)} // Toggle isActive state on button click
        >
          <X />
        </button>
      ) : (
        <button
          className="py-3 px-3 border w-50 mb-3 flex rounded-full gap-2 "
          onClick={() => setIsActive(!isActive)} // Toggle isActive state on button click
        >
          <SlidersHorizontal strokeWidth={1.25} />
        </button>
      )}


      <AnimatePresence>
        {isActive && <Modal isActive={isActive} toggleMenu={() => setIsActive(!isActive)} setVenues={setVenues} venues={venues} setFilteredVenues={setFilteredVenues} />}
      </AnimatePresence>
    </motion.div>
  );
}
