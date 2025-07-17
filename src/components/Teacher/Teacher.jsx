import "./Teacher.css";

function Teacher({ photo_url, name, speciality, description }) {
  return (
    <div className="component-teacher">
      <div className="info">
        <img src={photo_url} alt={name} width="96" height="96" className="image" />
        <div className="flow">
          <p className="name">{name}</p>
          <p className="role">{speciality}</p>
        </div>
      </div>
      <p className="description">{description}</p>
    </div>
  );
}

export default Teacher;
