import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import Headers from '../Headers'
import Project from '../Project'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

const ProjectsSection = props => {
  const {categoriesList} = props
  const [category, setCategory] = useState(categoriesList[0].id)
  const [details, setDetails] = useState({
    projects: [],
    apiStatus: apiStatusConstants.initial,
  })

  const modifyProject = obj => ({
    id: obj.id,
    name: obj.name,
    imageUrl: obj.image_url,
  })

  const getProjectsData = async () => {
    setDetails({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${category}`
    const response = await fetch(apiUrl)
    if (response.ok) {
      const data = await response.json()
      const updatedProjects = data.projects.map(eachProject =>
        modifyProject(eachProject),
      )
      setDetails({
        apiStatus: apiStatusConstants.success,
        projects: updatedProjects,
      })
    } else {
      setDetails({apiStatus: apiStatusConstants.failure})
    }
  }

  useEffect(() => {
    getProjectsData()
  }, [category])

  const renderSelectStatements = () => (
    <select value={category} onChange={e => setCategory(e.target.value)}>
      {categoriesList.map(eachCategory => (
        <option value={eachCategory.id} key={eachCategory.id}>
          {eachCategory.displayText}
        </option>
      ))}
    </select>
  )

  const renderLoaderView = () => (
    <div data-testid="loader" className="container">
      <Loader type="ThreeDots" color="#328af2" height="50px" width="50px" />
    </div>
  )

  const renderFailureView = () => (
    <div className="container">
      <img
        className="failure-img"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png "
        alt="failure view"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-text">
        We cannot seem to find the page you are looking for.
      </p>
      <button onClick={getProjectsData} className="btn" type="button">
        Retry
      </button>
    </div>
  )

  const renderSuccessView = () => (
    <ul className="projects-container">
      {details.projects.map(eachProject => (
        <Project key={eachProject.id} projectDetails={eachProject} />
      ))}
    </ul>
  )

  const renderProjects = () => {
    switch (details.apiStatus) {
      case apiStatusConstants.inProgress:
        return renderLoaderView()

      case apiStatusConstants.failure:
        return renderFailureView()
      case apiStatusConstants.success:
        return renderSuccessView()
      default:
        return null
    }
  }

  return (
    <>
      <Headers />
      <div className="home-container">
        {renderSelectStatements()}
        {renderProjects()}
      </div>
    </>
  )
}

export default ProjectsSection
