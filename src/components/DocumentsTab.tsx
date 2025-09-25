// src/components/DocumentsTab.tsx
import { Download } from 'lucide-react';

type DocumentItem = {
  title: string;
  description: string;
  url: string;
};

const documents: DocumentItem[] = [
  {
    title: 'Document name',
    description:
      "Below, you'll find all the legal and financial documents related to this property. These documents provide full transparency on ownership, investment terms, and financial performance. Please review them carefully before making an investment decision.",
    url: '/docs/document1.pdf',
  },
  {
    title: 'Document name',
    description:
      "Below, you'll find all the legal and financial documents related to this property. These documents provide full transparency on ownership, investment terms, and financial performance. Please review them carefully before making an investment decision.",
    url: '/docs/document2.pdf',
  },
  {
    title: 'Document name',
    description:
      "Below, you'll find all the legal and financial documents related to this property. These documents provide full transparency on ownership, investment terms, and financial performance. Please review them carefully before making an investment decision.",
    url: '/docs/document3.pdf',
  },
  {
    title: 'Document name',
    description:
      "Below, you'll find all the legal and financial documents related to this property. These documents provide full transparency on ownership, investment terms, and financial performance. Please review them carefully before making an investment decision.",
    url: '/docs/document4.pdf',
  },
];

export default function DocumentsTab() {
  return (
    <div className="space-y-10">
      {/* Title Section */}
      <div className="space-y-2">
        <h3 className="text-[22px] font-bold text-fraction-violet-500">
          Documents
        </h3>
        <p className="text-[15px] text-fraction-blue-300 font-medium">
          Property Documents & Legal Information
        </p>
        <p className="text-[14px] text-fraction-violet-500">
          Below, you'll find all the legal and financial documents related to
          this property. These documents provide full transparency on ownership,
          investment terms, and financial performance. Please review them
          carefully before making an investment decision.
        </p>
      </div>

      {/* Documents List */}
      <div className="rounded-xl border border-fraction-gray-500 p-5 space-y-4">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center p-5 rounded-lg bg-fraction-light-150  shadow-sm"
          >
            <div>
              <h4 className="text-[16px] font-semibold text-fraction-violet-500">
                {doc.title}
              </h4>
              <p className="mt-1 text-[13px] leading-relaxed text-fraction-violet-500">
                {doc.description}
              </p>
            </div>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 text-fraction-violet-500 hover:text-fraction-violet-700 flex-shrink-0"
            >
              <Download size={22} strokeWidth={2.5} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
