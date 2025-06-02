import "./Course.css";
function Course({ image, title, price, description }) {
  return (
    <div className="course">
      <div className="pres">
        <img src={image} alt={title} className="course-image" />
        <p className="title">{title}</p>
        <p className="det">Curso virtual - Zoom</p>
        <p className="price">S/ {price}</p>
      </div>
      <p className="description">{description}</p>
      <button className="btn-buy">Comprar</button>
    </div>
  );
}

export default Course;
