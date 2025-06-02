import "./Teacher.css";

function Teacher({ image, name, role, description }) {
  return (
    <div className="teacher">
      <div className="info">
        <img src={image} alt={name} className="image" />
        <div className="flow">
          <p className="name">{name}</p>
          <p className="role">{role}</p>
        </div>
      </div>
      <p className="description">{description}</p>
    </div>
  );
}

export default Teacher;
