import React, { useEffect, useState } from "react";
import {
    Button, TextField, Grid, Box,
    Typography, CircularProgress, Stack, IconButton
} from "@mui/material";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import Popup from '../../../components/Popup';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const SubjectForm = () => {
    const [subjects, setSubjects] = useState([{ subName: "", subCode: "", sessions: "" }]);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;

    const sclassName = params.id;
    const adminID = currentUser._id;
    const address = "Subject";

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    const handleSubjectNameChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subName = event.target.value;
        setSubjects(newSubjects);
    };

    const handleSubjectCodeChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].subCode = event.target.value;
        setSubjects(newSubjects);
    };

    const handleSessionsChange = (index) => (event) => {
        const newSubjects = [...subjects];
        newSubjects[index].sessions = event.target.value || 0;
        setSubjects(newSubjects);
    };

    const handleAddSubject = () => {
        setSubjects([...subjects, { subName: "", subCode: "", sessions: "" }]);
    };

    const handleRemoveSubject = (index) => () => {
        const newSubjects = [...subjects];
        newSubjects.splice(index, 1);
        setSubjects(newSubjects);
    };

    const fields = {
        sclassName,
        subjects: subjects.map((subject) => ({
            subName: subject.subName,
            subCode: subject.subCode,
            sessions: subject.sessions,
        })),
        adminID,
    };

    const submitHandler = (event) => {
        event.preventDefault();
        setLoader(true);
        dispatch(addStuff(fields, address));
    };

    useEffect(() => {
        if (status === 'added') {
            navigate("/Admin/subjects");
            dispatch(underControl());
            setLoader(false);
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <>
            <PageWrapper>
                <FormCard>
                    <FormHeader>
                        <HeaderIcon>
                            <PostAddIcon sx={{ fontSize: 28, color: 'white' }} />
                        </HeaderIcon>
                        <Typography variant="h5" fontWeight={800} color="#1a1a2e">
                            Add Subjects
                        </Typography>
                        <Typography variant="body2" color="#888" mt={0.5}>
                            Add one or more subjects to this class
                        </Typography>
                    </FormHeader>

                    <form onSubmit={submitHandler}>
                        <Stack spacing={3}>
                            {subjects.map((subject, index) => (
                                <SubjectBlock key={index} index={index}>
                                    <SubjectBlockHeader>
                                        <SubjectNumber>Subject {index + 1}</SubjectNumber>
                                        {index > 0 && (
                                            <RemoveBtn
                                                type="button"
                                                onClick={handleRemoveSubject(index)}
                                            >
                                                <DeleteOutlineIcon sx={{ fontSize: 16, mr: 0.5 }} />
                                                Remove
                                            </RemoveBtn>
                                        )}
                                    </SubjectBlockHeader>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label="Subject Name"
                                                variant="outlined"
                                                value={subject.subName}
                                                onChange={handleSubjectNameChange(index)}
                                                placeholder="e.g. Mathematics"
                                                sx={inputStyle}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                label="Subject Code"
                                                variant="outlined"
                                                value={subject.subCode}
                                                onChange={handleSubjectCodeChange(index)}
                                                placeholder="e.g. MATH101"
                                                sx={inputStyle}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                fullWidth
                                                label="Sessions"
                                                variant="outlined"
                                                type="number"
                                                inputProps={{ min: 0 }}
                                                value={subject.sessions}
                                                onChange={handleSessionsChange(index)}
                                                placeholder="e.g. 30"
                                                sx={inputStyle}
                                                required
                                            />
                                        </Grid>
                                    </Grid>
                                </SubjectBlock>
                            ))}

                            <AddMoreBtn type="button" onClick={handleAddSubject}>
                                <AddCircleOutlineIcon sx={{ mr: 1, fontSize: 18 }} />
                                Add Another Subject
                            </AddMoreBtn>

                            <SubmitButton type="submit" disabled={loader}>
                                {loader
                                    ? <CircularProgress size={22} color="inherit" />
                                    : <><PostAddIcon sx={{ mr: 1, fontSize: 18 }} /> Save Subjects</>
                                }
                            </SubmitButton>

                            <BackButton type="button" onClick={() => navigate(-1)}>
                                Go Back
                            </BackButton>
                        </Stack>
                    </form>
                </FormCard>
            </PageWrapper>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default SubjectForm;

// ── Styled Components ──────────────────────────────────────────

const PageWrapper = styled.div`
    min-height: 100vh;
    background: #f0f2f5;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
`;

const FormCard = styled.div`
    background: white;
    border-radius: 24px;
    padding: 40px;
    width: 100%;
    max-width: 560px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.08);
    animation: ${fadeUp} 0.5s ease forwards;
`;

const FormHeader = styled.div`
    text-align: center;
    margin-bottom: 32px;
`;

const HeaderIcon = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 16px;
    background: linear-gradient(135deg, #4facfe, #00f2fe);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px auto;
    box-shadow: 0 4px 16px rgba(79,172,254,0.4);
`;

const SubjectBlock = styled.div`
    background: ${props => props.index % 2 === 0 ? '#f8f9ff' : '#fff8f8'};
    border-radius: 16px;
    padding: 20px;
    border: 2px solid ${props => props.index % 2 === 0 ? '#e8edff' : '#ffe8e8'};
    animation: ${fadeUp} 0.3s ease forwards;
`;

const SubjectBlockHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
`;

const SubjectNumber = styled.span`
    font-size: 0.85rem;
    font-weight: 700;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
`;

const RemoveBtn = styled.button`
    display: flex;
    align-items: center;
    background: #fff0f0;
    color: #f5576c;
    border: none;
    border-radius: 8px;
    padding: 5px 10px;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover { background: #f5576c; color: white; }
`;

const inputStyle = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '10px',
        background: 'white',
        '&:hover fieldset': { borderColor: '#4facfe' },
        '&.Mui-focused fieldset': { borderColor: '#4facfe' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#4facfe' },
};

const AddMoreBtn = styled.button`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: #4facfe;
    border: 2px dashed #4facfe;
    border-radius: 12px;
    padding: 12px;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background: #4facfe15;
    }
`;

const SubmitButton = styled.button`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #4facfe, #00f2fe);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 14px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(79,172,254,0.4);

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(79,172,254,0.5);
    }

    &:disabled { opacity: 0.7; cursor: not-allowed; }
`;

const BackButton = styled.button`
    width: 100%;
    background: transparent;
    color: #888;
    border: 2px solid #eee;
    border-radius: 12px;
    padding: 12px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover { border-color: #4facfe; color: #4facfe; }
`;