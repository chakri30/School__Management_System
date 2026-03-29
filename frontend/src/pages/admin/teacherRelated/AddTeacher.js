import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectDetails } from '../../../redux/sclassRelated/sclassHandle';
import Popup from '../../../components/Popup';
import { registerUser } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import {
  TextField, CircularProgress, Typography, Stack,
  Chip
} from '@mui/material';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ClassIcon from '@mui/icons-material/Class';
import BookIcon from '@mui/icons-material/Book';
import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AddTeacher = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subjectID = params.id;

  const { status, response, error } = useSelector(state => state.user);
  const { subjectDetails } = useSelector((state) => state.sclass);

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, "Subject"));
  }, [dispatch, subjectID]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");
  const [loader, setLoader] = useState(false);

  const role = "Teacher";
  const school = subjectDetails && subjectDetails.school;
  const teachSubject = subjectDetails && subjectDetails._id;
  const teachSclass = subjectDetails && subjectDetails.sclassName && subjectDetails.sclassName._id;

  const fields = { name, email, password, role, school, teachSubject, teachSclass };

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(registerUser(fields, role));
  };

  useEffect(() => {
    if (status === 'added') {
      dispatch(underControl());
      navigate("/Admin/teachers");
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
              <SupervisorAccountIcon sx={{ fontSize: 28, color: 'white' }} />
            </HeaderIcon>
            <Typography variant="h5" fontWeight={800} color="#1a1a2e">
              Add New Teacher
            </Typography>
            <Typography variant="body2" color="#888" mt={0.5}>
              Register a teacher for the selected subject
            </Typography>
          </FormHeader>

          {/* Subject & Class Info */}
          <InfoBanner>
            <InfoItem>
              <BookIcon sx={{ fontSize: 16, color: '#764ba2', mr: 0.5 }} />
              <InfoLabel>Subject:</InfoLabel>
              <InfoValue>{subjectDetails?.subName || 'Loading...'}</InfoValue>
            </InfoItem>
            <InfoItem>
              <ClassIcon sx={{ fontSize: 16, color: '#4facfe', mr: 0.5 }} />
              <InfoLabel>Class:</InfoLabel>
              <InfoValue>{subjectDetails?.sclassName?.sclassName || 'Loading...'}</InfoValue>
            </InfoItem>
          </InfoBanner>

          <form onSubmit={submitHandler}>
            <Stack spacing={3}>
              <TextField
                label="Teacher Name"
                variant="outlined"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
                fullWidth
                sx={inputStyle}
              />

              <TextField
                label="Email Address"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
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

              <SubmitButton type="submit" disabled={loader}>
                {loader
                  ? <CircularProgress size={22} color="inherit" />
                  : <><SupervisorAccountIcon sx={{ mr: 1, fontSize: 18 }} /> Register Teacher</>
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

export default AddTeacher;

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
    animation: ${fadeUp} 0.5s ease forwards;
`;

const FormHeader = styled.div`
    text-align: center;
    margin-bottom: 24px;
`;

const HeaderIcon = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 16px;
    background: linear-gradient(135deg, #764ba2, #f5576c);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px auto;
    box-shadow: 0 4px 16px rgba(118,75,162,0.4);
`;

const InfoBanner = styled.div`
    background: linear-gradient(135deg, #f8f4ff, #fff0f5);
    border-radius: 14px;
    padding: 16px 20px;
    margin-bottom: 28px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border: 1px solid #e8d5f5;
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const InfoLabel = styled.span`
    font-size: 0.85rem;
    color: #888;
    font-weight: 500;
    margin-right: 4px;
`;

const InfoValue = styled.span`
    font-size: 0.9rem;
    font-weight: 700;
    color: #333;
`;

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '&:hover fieldset': { borderColor: '#764ba2' },
    '&.Mui-focused fieldset': { borderColor: '#764ba2' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#764ba2' },
};

const SubmitButton = styled.button`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #764ba2, #f5576c);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 14px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(118,75,162,0.4);

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(118,75,162,0.5);
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

    &:hover { border-color: #764ba2; color: #764ba2; }
`;