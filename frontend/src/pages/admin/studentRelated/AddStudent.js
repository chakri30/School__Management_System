import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { getAllSclasses } from '../../../redux/sclassRelated/sclassHandle';
import {
    Box, TextField, Button, CircularProgress,
    MenuItem, Select, InputLabel, FormControl,
    Typography, Stack, Paper
} from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AddStudent = ({ situation }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;
    const { sclassesList } = useSelector((state) => state.sclass);

    const [name, setName] = useState('');
    const [rollNum, setRollNum] = useState('');
    const [password, setPassword] = useState('');
    const [sclassName, setSclassName] = useState('');

    const adminID = currentUser._id;
    const role = "Student";
    const attendance = [];

    useEffect(() => {
        if (situation === "Class") {
            setSclassName(params.id);
        }
    }, [params.id, situation]);

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        dispatch(getAllSclasses(adminID, "Sclass"));
    }, [adminID, dispatch]);

    const fields = { name, rollNum, password, sclassName, adminID, role, attendance };

    const submitHandler = (event) => {
        event.preventDefault();
        if (sclassName === "") {
            setMessage("Please select a class");
            setShowPopup(true);
        } else {
            setLoader(true);
            dispatch(registerUser(fields, role));
        }
    };

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl());
            navigate(-1);
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
                            <PersonAddAlt1Icon sx={{ fontSize: 28, color: 'white' }} />
                        </HeaderIcon>
                        <Typography variant="h5" fontWeight={800} color="#1a1a2e">
                            Add New Student
                        </Typography>
                        <Typography variant="body2" color="#888" mt={0.5}>
                            Fill in the details to register a student
                        </Typography>
                    </FormHeader>

                    <form onSubmit={submitHandler}>
                        <Stack spacing={3}>
                            <TextField
                                label="Student Name"
                                variant="outlined"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="name"
                                required
                                fullWidth
                                sx={inputStyle}
                            />

                            {situation === "Student" && (
                                <FormControl fullWidth required sx={inputStyle}>
                                    <InputLabel id="class-select-label">Select Class</InputLabel>
                                    <Select
                                        labelId="class-select-label"
                                        id="class-select"
                                        value={sclassName}
                                        label="Select Class"
                                        onChange={(e) => setSclassName(e.target.value)}
                                    >
                                        <MenuItem value="" disabled>
                                            <em>-- Select a Class --</em>
                                        </MenuItem>
                                        {sclassesList && sclassesList.length > 0
                                            ? sclassesList.map((cls) => (
                                                <MenuItem key={cls._id} value={cls._id}>
                                                    {cls.sclassName}
                                                </MenuItem>
                                            ))
                                            : (
                                                <MenuItem disabled>
                                                    No classes available
                                                </MenuItem>
                                            )
                                        }
                                    </Select>
                                </FormControl>
                            )}

                            <TextField
                                label="Roll Number"
                                variant="outlined"
                                type="number"
                                value={rollNum}
                                onChange={(e) => setRollNum(e.target.value)}
                                required
                                fullWidth
                                sx={inputStyle}
                            />

                            <TextField
                                label="Password"
                                variant="outlined"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                                fullWidth
                                sx={inputStyle}
                            />

                            <SubmitButton
                                type="submit"
                                disabled={loader}
                            >
                                {loader
                                    ? <CircularProgress size={22} color="inherit" />
                                    : <><PersonAddAlt1Icon sx={{ mr: 1, fontSize: 18 }} /> Add Student</>
                                }
                            </SubmitButton>

                            <BackButton
                                type="button"
                                onClick={() => navigate(-1)}
                            >
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

export default AddStudent;

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
    max-width: 480px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.08);
    animation: fadeUp 0.5s ease forwards;
`;

const FormHeader = styled.div`
    text-align: center;
    margin-bottom: 32px;
`;

const HeaderIcon = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 16px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px auto;
    box-shadow: 0 4px 16px rgba(102,126,234,0.4);
`;

const inputStyle = {
    '& .MuiOutlinedInput-root': {
        borderRadius: '12px',
        '&:hover fieldset': { borderColor: '#667eea' },
        '&.Mui-focused fieldset': { borderColor: '#667eea' },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: '#667eea' },
};

const SubmitButton = styled.button`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 14px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(102,126,234,0.4);

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(102,126,234,0.5);
    }

    &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
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

    &:hover {
        border-color: #667eea;
        color: #667eea;
    }
`;