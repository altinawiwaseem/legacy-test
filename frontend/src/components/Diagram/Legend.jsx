const Legend = ({ colorData }) => {
  return (
    <div className="flex space-x-4 mt-4">
      {colorData.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className={`w-4 h-4 ${item.color}`}></div>
          <span>{item.description}</span>
        </div>
      ))}
    </div>
  );
};

export default Legend;
