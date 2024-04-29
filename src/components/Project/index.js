import './index.css'

const Project = props => {
  const {projectDetails} = props
  const {imageUrl, name} = projectDetails
  return (
    <li className="project">
      <img className="pro-image" src={imageUrl} alt={name} />
      <p className="pro-name">{name}</p>
    </li>
  )
}

export default Project
