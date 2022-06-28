import "./directory-list.styles.scss";

import DirectoryItem from "../directory-item/directory-item.component";

const DirectoryList = ({ categories }) => {
  return (
    <div className="directory-list-container">
      {categories.map((category) => (
        <DirectoryItem key={category.id} {...category} />
      ))}
    </div>
  );
};

export default DirectoryList;
