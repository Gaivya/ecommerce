import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import DOMPurify from "dompurify";

// Function to decode HTML entities
const decodeHtmlEntities = (text) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};

const PolicyPage = () => {
  const location = useLocation();
  const policy = location.state?.policy;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location]);

  // Default to empty string if policy or content is missing
  const content = policy ? policy.content : "";

  // Decode HTML entities
  const decodedContent = decodeHtmlEntities(content);

  // Sanitize the HTML content
  const sanitizedContent = DOMPurify.sanitize(decodedContent);

  return (
    <div className="lg:mx-[60px] px-[15px] ">
      {policy ? (
        <div>
          <div
            dangerouslySetInnerHTML={{ __html: sanitizedContent }} // Render sanitized HTML
          />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PolicyPage;
