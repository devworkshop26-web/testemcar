import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export const FaqItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="bg-white border border-gray-100 rounded-xl mb-3 overflow-hidden transition-all duration-300 hover:shadow-md">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-4 px-6 flex justify-between items-center text-left hover:bg-gray-50 transition-colors"
            >
                <span className="font-bold text-gray-900 text-sm md:text-base">{question}</span>
                {isOpen ? <ChevronUp size={20} className="text-primary-600"/> : <ChevronDown size={20} className="text-gray-400"/>}
            </button>

            <div className={`transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                <div className="p-6 pt-0 text-gray-500 text-sm border-t bg-gray-50/30">
                    {answer}
                </div>
            </div>
        </div>
    );
};
