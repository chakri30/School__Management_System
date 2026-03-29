import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container, Grid, Box, Avatar, Typography,
  Chip, Divider, TextField, Button, IconButton, Tooltip,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import BadgeIcon from '@mui/icons-material/Badge';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import CakeIcon from '@mui/icons-material/Cake';
import PersonIcon from '@mui/icons-material/Person';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';

/* ─── Animations ─────────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

/* ─── Styled Components ───────────────────────────────────── */
const PageWrapper = styled(Box)`
  min-height: 100vh;
  background: #f0f4f8;
  padding: 40px 0 60px;
  font-family: 'Georgia', serif;
`;

const HeroCard = styled(Box)`
  background: linear-gradient(135deg, #1a237e 0%, #283593 50%, #1565c0 100%);
  border-radius: 24px;
  padding: 48px 32px 40px;
  color: #fff;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(26,35,126,0.35);
  animation: ${fadeUp} 0.6s ease both;
  margin-bottom: 24px;

  &::before {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 260px; height: 260px;
    background: rgba(255,255,255,0.07);
    border-radius: 50%;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -60px; left: -60px;
    width: 200px; height: 200px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
  }
`;

const StyledAvatar = styled(Avatar)`
  width: 110px !important;
  height: 110px !important;
  font-size: 2.8rem !important;
  font-family: 'Georgia', serif !important;
  background: linear-gradient(135deg, #42a5f5, #7c4dff) !important;
  border: 4px solid rgba(255,255,255,0.4) !important;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25) !important;
  margin-bottom: 16px;
`;

const BadgeChip = styled(Chip)`
  background: rgba(255,255,255,0.18) !important;
  color: #fff !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  border: 1px solid rgba(255,255,255,0.3) !important;
  margin: 4px !important;
  .MuiChip-icon { color: rgba(255,255,255,0.85) !important; }
`;

const InfoCard = styled(Box)`
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  animation: ${fadeUp} 0.6s ease both;
  animation-delay: ${({ delay }) => delay || '0s'};
  opacity: 0;
  animation-fill-mode: forwards;
`;

const SectionLabel = styled(Typography)`
  font-family: 'Georgia', serif !important;
  font-size: 0.7rem !important;
  font-weight: 700 !important;
  letter-spacing: 2.5px !important;
  text-transform: uppercase !important;
  color: #1a237e !important;
  margin-bottom: 20px !important;
`;

const InfoRow = styled(Box)`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid #f0f4f8;
  transition: background 0.2s;
  &:last-child { border-bottom: none; }
  &:hover {
    background: #f8f9ff;
    border-radius: 10px;
    padding-left: 8px;
    padding-right: 8px;
    margin: 0 -8px;
  }
`;

const IconWrapper = styled(Box)`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${({ bg }) => bg || '#e8eaf6'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 6px;
  svg {
    font-size: 18px;
    color: ${({ iconcolor }) => iconcolor || '#3949ab'};
  }
`;

const InfoLabel = styled(Typography)`
  font-size: 0.72rem !important;
  color: #9e9e9e !important;
  font-family: 'Georgia', serif !important;
  margin-bottom: 2px !important;
`;

const InfoValue = styled(Typography)`
  font-size: 0.95rem !important;
  color: #1a237e !important;
  font-weight: 600 !important;
  font-family: 'Georgia', serif !important;
`;

const GlowDivider = styled(Divider)`
  margin: 28px 0 !important;
  background: linear-gradient(90deg, transparent, #c5cae9, transparent) !important;
  height: 1.5px !important;
  border: none !important;
`;

const EditButton = styled(Button)`
  background: rgba(255,255,255,0.18) !important;
  color: #fff !important;
  border: 1px solid rgba(255,255,255,0.35) !important;
  border-radius: 12px !important;
  font-family: 'Georgia', serif !important;
  font-weight: 600 !important;
  text-transform: none !important;
  padding: 7px 20px !important;
  backdrop-filter: blur(4px);
  transition: background 0.2s !important;
  &:hover { background: rgba(255,255,255,0.28) !important; }
`;

const SaveBtn = styled(Button)`
  background: linear-gradient(135deg, #1a237e, #1565c0) !important;
  color: #fff !important;
  border-radius: 12px !important;
  font-family: 'Georgia', serif !important;
  font-weight: 600 !important;
  text-transform: none !important;
  padding: 8px 24px !important;
  box-shadow: 0 4px 14px rgba(26,35,126,0.3) !important;
  &:hover { box-shadow: 0 6px 20px rgba(26,35,126,0.45) !important; }
`;

const CancelBtn = styled(Button)`
  color: #9e9e9e !important;
  font-family: 'Georgia', serif !important;
  font-weight: 600 !important;
  text-transform: none !important;
  padding: 8px 18px !important;
  border-radius: 12px !important;
  &:hover { background: #f5f5f5 !important; }
`;

/* ─── Editable text field theme override ─────────────────── */
const fieldSx = {
  '& .MuiOutlinedInput-root': {
    fontFamily: 'Georgia, serif',
    fontSize: '0.95rem',
    fontWeight: 600,
    color: '#1a237e',
    borderRadius: '10px',
    '& fieldset': { borderColor: '#c5cae9' },
    '&:hover fieldset': { borderColor: '#3949ab' },
    '&.Mui-focused fieldset': { borderColor: '#1a237e' },
  },
  '& .MuiInputLabel-root': {
    fontFamily: 'Georgia, serif',
    fontSize: '0.75rem',
    color: '#9e9e9e',
    '&.Mui-focused': { color: '#1a237e' },
  },
};

/* ─── Component ───────────────────────────────────────────── */
const StudentProfile = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const sclassName = currentUser?.sclassName;
  const studentSchool = currentUser?.school;

  /* Local editable state — initialised from currentUser or sensible defaults */
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    dob: currentUser?.dob || 'January 1, 2000',
    gender: currentUser?.gender || 'Male',
    email: currentUser?.email || 'john.doe@example.com',
    phone: currentUser?.phone || '(123) 456-7890',
    address: currentUser?.address || '123 Main Street, City, Country',
    emergencyContact: currentUser?.emergencyContact || '(987) 654-3210',
  });
  const [draft, setDraft] = useState(form);

  const handleEdit = () => {
    setDraft(form);   // reset draft to current saved values
    setEditing(true);
  };

  const handleCancel = () => {
    setDraft(form);
    setEditing(false);
  };

  const handleChange = (key) => (e) => {
    setDraft((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSave = async () => {
    setForm(draft);
    setEditing(false);

    await axios.put(`/StudentProfile/${currentUser._id}`, draft);
  };

  const infoFields = [
    {
      key: 'dob',
      icon: <CakeIcon />,
      label: 'Date of Birth',
      bg: '#fce4ec',
      iconcolor: '#c62828',
    },
    {
      key: 'gender',
      icon: <PersonIcon />,
      label: 'Gender',
      bg: '#e3f2fd',
      iconcolor: '#1565c0',
    },
    {
      key: 'email',
      icon: <EmailIcon />,
      label: 'Email Address',
      bg: '#e8f5e9',
      iconcolor: '#2e7d32',
      type: 'email',
    },
    {
      key: 'phone',
      icon: <PhoneIcon />,
      label: 'Phone Number',
      bg: '#fff3e0',
      iconcolor: '#e65100',
      type: 'tel',
    },
    {
      key: 'address',
      icon: <HomeIcon />,
      label: 'Address',
      bg: '#f3e5f5',
      iconcolor: '#6a1b9a',
    },
    {
      key: 'emergencyContact',
      icon: <ContactPhoneIcon />,
      label: 'Emergency Contact',
      bg: '#ffebee',
      iconcolor: '#b71c1c',
      type: 'tel',
    },
  ];

  return (
    <PageWrapper>
      <Container maxWidth="md">
        {/* ── Hero / identity block ── */}
        <HeroCard mb={3}>
          {/* Edit toggle in top-right corner of hero */}
          <Box position="absolute" top={20} right={24} zIndex={2}>
            {editing ? (
              <Tooltip title="Cancel editing">
                <IconButton
                  onClick={handleCancel}
                  size="small"
                  sx={{
                    background: 'rgba(255,255,255,0.18)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': { background: 'rgba(255,255,255,0.28)' },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : (
              <EditButton startIcon={<EditIcon />} onClick={handleEdit} size="small">
                Edit Profile
              </EditButton>
            )}
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center" position="relative" zIndex={1}>
            <StyledAvatar>
              {String(currentUser?.name ?? 'S').charAt(0)}
            </StyledAvatar>

            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Georgia, serif',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-0.5px',
                mb: 0.5,
                textAlign: 'center',
              }}
            >
              {currentUser?.name}
            </Typography>

            <Typography
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontFamily: 'Georgia, serif',
                fontSize: '0.9rem',
                mb: 2.5,
              }}
            >
              Student
            </Typography>

            <Box display="flex" flexWrap="wrap" justifyContent="center" gap={0.5}>
              <BadgeChip icon={<BadgeIcon />} label={`Roll No: ${currentUser?.rollNum}`} size="small" />
              <BadgeChip icon={<SchoolIcon />} label={`Class: ${sclassName?.sclassName}`} size="small" />
              <BadgeChip icon={<SchoolIcon />} label={studentSchool?.schoolName} size="small" />
            </Box>
          </Box>
        </HeroCard>

        {/* ── Personal Information ── */}
        <InfoCard delay="0.15s">
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={0}>
            <SectionLabel>Personal Information</SectionLabel>
            {editing && (
              <Typography
                sx={{
                  fontSize: '0.75rem',
                  color: '#1565c0',
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                }}
              >
                Editing — make your changes below
              </Typography>
            )}
          </Box>
          <GlowDivider />

          <Grid container>
            {infoFields.map((field) => (
              <Grid item xs={12} sm={6} key={field.key}>
                <InfoRow>
                  <IconWrapper bg={field.bg} iconcolor={field.iconcolor}>
                    {field.icon}
                  </IconWrapper>
                  <Box flex={1}>
                    {editing ? (
                      <TextField
                        label={field.label}
                        type={field.type || 'text'}
                        value={draft[field.key]}
                        onChange={handleChange(field.key)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={fieldSx}
                      />
                    ) : (
                      <>
                        <InfoLabel>{field.label}</InfoLabel>
                        <InfoValue>{form[field.key]}</InfoValue>
                      </>
                    )}
                  </Box>
                </InfoRow>
              </Grid>
            ))}
          </Grid>

          {/* ── Save / Cancel actions (only in edit mode) ── */}
          {editing && (
            <Box display="flex" justifyContent="flex-end" gap={1.5} mt={3}>
              <CancelBtn onClick={handleCancel}>Cancel</CancelBtn>
              <SaveBtn startIcon={<SaveIcon />} onClick={handleSave}>
                Save Changes
              </SaveBtn>
            </Box>
          )}
        </InfoCard>
      </Container>
    </PageWrapper>
  );
};

export default StudentProfile;