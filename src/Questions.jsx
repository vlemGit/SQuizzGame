import { useState, useEffect } from "react";

const Questions = () => {
    const [token, setToken] = useState("");
    const [questions, setQuestions] = useState([]);

    const handleTokenApi = () => {
        fetch('https://opentdb.com/api_token.php?command=request')
            .then((res) => res.json())
            .then((data) => {
                setToken(data.token);
            })
            .catch((error) => console.error("Erreur lors de la récupération du token:", error));
    };


    const handleFetchingQuestions = () => {
        if (token) {
            fetch(`https://opentdb.com/api.php?amount=10&token=${token}`)
                .then((res) => res.json())
                .then((data) => {
                    if (data.response_code === 0) {
                        console.log(data);
                        setQuestions(data.results);
                    } else if(data.response_code === 1) {
                        console.error("No Results Could not return results. The API doesn't have enough questions for your query. (Ex. Asking for 50 Questions in a Category that only has 20.)");
                    } else if(data.response_code === 2) {
                        console.error("Invalid Parameter Contains an invalid parameter. Arguements passed in aren't valid. (Ex. Amount = Five)");
                    } else if(data.response_code === 4) {
                        // refresh token or create new one
                        console.error("Token Empty Session Token has returned all possible questions for the specified query. Resetting the Token is necessary.");
                    } else if(data.response_code === 5) {
                        console.error("Rate Limit Too many requests have occurred. Each IP can only access the API once every 5 seconds.");
                    }
                })
                .catch((error) => console.error("Something went wrong when fetching the questions :", error));
        } else { // response_code 3
            console.error("Token Not Found Session Token does not exist.");
        }
    };

    // Get the token when we mount the component.
    useEffect(() => {
        handleTokenApi();
    }, []);

    return (
        <>
            <h1>Questions</h1>
            <div>
                <button onClick={handleFetchingQuestions}>Generate questions</button>
                <ul>
                    {questions.map((question) => (
                        <li key={question.question}>{question.question}</li> // key={question.question}  it's the only UNIQUE data that we get from the api for this call
                    ))}
                </ul>
            </div>
        </>
    );
};

export default Questions;
