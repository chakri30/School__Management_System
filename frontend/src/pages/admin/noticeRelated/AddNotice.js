import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addStuff } from '../../../redux/userRelated/userHandle';
import { underControl } from '../../../redux/userRelated/userSlice';
import { CircularProgress, TextField, Typography, Stack } from '@mui/material';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import Popup from '../../../components/Popup';
import styled, { keyframes } from 'styled-components';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const AddNotice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, response, error } = useSelector(state => state.user);
  const { currentUser } = useSelector(state => state.user);

  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState('');
  const adminID = currentUser._id;

  const [loader, setLoader] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [message, setMessage] = useState("");

  const fields = { title, details, date, adminID };
  const address = "Notice";

  const submitHandler = (event) => {
    event.preventDefault();
    setLoader(true);
    dispatch(addStuff(fields, address));
  };

  useEffect(() => {
    if (status === 'added') {
      navigate('/Admin/notices');
      dispatch(underControl());
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
              <AnnouncementIcon sx={{ fontSize: 28, color: 'white' }} />
            </HeaderIcon>
            <Typography variant="h5" fontWeight={800} color="#1a1a2e">
              Add New Notice
            </Typography>
            <Typography variant="body2" color="#888" mt={0.5}>
              Publish a notice for students and teachers
            </Typography>
          </FormHeader>

          <form onSubmit={submitHandler}>
            <Stack spacing={3}>
              <TextField
                label="Notice Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
                placeholder="e.g. Annual Sports Day"
                sx={inputStyle}
              />

              <TextField
                label="Notice Details"
                variant="outlined"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                required
                fullWidth
                multiline
                rows={4}
                placeholder="Enter the full details of the notice..."
                sx={inputStyle}
              />

              <TextField
                label="Date"
                variant="outlined"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={inputStyle}
              />

              <SubmitButton type="submit" disabled={loader}>
                {loader
                  ? <CircularProgress size={22} color="inherit" />
                  : <><AnnouncementIcon sx={{ mr: 1, fontSize: 18 }} /> Publish Notice</>
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

export default AddNotice;

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
    max-width: 500px;
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
    background: linear-gradient(135deg, #f5576c, #f093fb);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px auto;
    box-shadow: 0 4px 16px rgba(245,87,108,0.4);
`;

const inputStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '&:hover fieldset': { borderColor: '#f5576c' },
    '&.Mui-focused fieldset': { borderColor: '#f5576c' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#f5576c' },
};

const SubmitButton = styled.button`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5576c, #f093fb);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 14px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(245,87,108,0.4);

    &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(245,87,108,0.5);
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

    &:hover { border-color: #f5576c; color: #f5576c; }
`;