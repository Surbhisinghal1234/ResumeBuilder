import React, { useContext, useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { inputContext } from "./Main";
import { useParams } from "react-router-dom";
import axios from "axios";

function Edit() {
  const { id } = useParams();

  const {
    email,
    setEmail,
    name,
    setName,
    role,
    setRole,
    totalExp,
    setTotalExp,
    message,
    setMessage,
    image,
    setImage,
    input,
    setInput,
    workExperience,
    setWorkExperience,
    skillProficiencies,
    setSkillProficiencies,
  } = useContext(inputContext);

  const urlObject = [
    "",
    "my-details",
    "about-me",
    "skills-and-proficiencies",
    "work-experiences",
  ];

  const [counter, setCounter] = useState(1);
  const [nextPage, setNextPage] = useState(urlObject[counter]);

  const handleNextClick = () => {
    setCounter(counter + 1);
  };

  useEffect(() => {
    if (id) {
      setNextPage(`${urlObject[counter]}/${id}`);
    } else {
      setNextPage(urlObject[counter]);
    }
  }, [counter, id]);

  const dataSave = {
    details: {
      email: email,
      image: image,
      name: name,
      role: role,
      totalExp: totalExp,
    },
    AboutMe: {
      message: message,
      pointers: input,
    },
    SkillsProficiencies: skillProficiencies,
    workExperience: workExperience,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://resumebuilder-backend-1.onrender.com/getById/${id}`);
        const { resumeData } = response.data;
        const { details, AboutMe, SkillsProficiencies, workExperience } =
          resumeData;
        const { image, name, email, role, totalExp } = details;
        const { message, pointers } = AboutMe;
        setName(name);
        // setImage(image);

        setEmail(email);
        setRole(role);
        setTotalExp(totalExp);
        setMessage(message);
        setInput(pointers || []);
        setSkillProficiencies(SkillsProficiencies || []);
        setWorkExperience(workExperience || []);
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    const jsonDataSave = JSON.stringify(dataSave);
    formData.append("dataSave", jsonDataSave);
    // formData.append("image",image);
    if (dataSave.details.image) {
      formData.append("image", dataSave.details.image);
    } else {
      console.warn("Image is not available");
    }
   

    try {
      const response = id
        ? await axios.put(`https://resumebuilder-backend-1.onrender.com/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await axios.post("https://resumebuilder-backend-1.onrender.com/send", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="resumeSection pb-8 md:pb-0 w-full md:w-1/2 px-[2rem] min-h-[15rem] bg-slate-200 md:bg-transparent border-y-2 border-slate-700 md:border-none">
        <form
          method="POST"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="form-group flex md:justify-end justify-center gap-4 items-center py-[2rem]">
            <Link
              className="next bg-slate-600 text-white font-medium rounded px-4 py-2 hover:bg-slate-900 "
              to={nextPage}
              onClick={handleNextClick}
            >
              Next <ArrowRightAltIcon />
            </Link>
            {/* <input type="file" onChange={handleImageChange} /> */}
         {/* <Link to="/create"
         > */}
          <button
              type="submit"
              className="bg-slate-600 hover:bg-slate-900 text-white font-bold px-6 py-[9px] rounded"
            >
              Submit
            </button>
            {/* </Link>    */}
          </div>
        </form>
        <Outlet />
      </div>
    </>
  );
}

export default Edit;
