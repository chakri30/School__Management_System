import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useSelector } from 'react-redux';
import {
  Box, Avatar, Typography, TextField, Button,
  Divider, Snackbar, Alert, IconButton, Tooltip, Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ClassIcon from '@mui/icons-material/Class';
import LockIcon from '@mui/icons-material/Lock';
import axios from 'axios';

/* ─── Animations ──────────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.35); }
  50%       { box-shadow: 0 0 0 14px rgba(16,185,129,0); }
`;

/* ─── Styled Components ───────────────────────────────────── */
const PageWrapper = styled(Box)`
  min-height: 100vh;
  background: #0c0f0e;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  font-family: 'Palatino Linotype', 'Book Antiqua', Palatino, serif;

  &::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 55% 45% at 75% 15%, rgba(16,185,129,0.10) 0%, transparent 60%),
      radial-gradient(ellipse 40% 50% at 15% 85%, rgba(5,150,105,0.07) 0%, transparent 60%);
    pointer-events: none;
  }
`;

const Card = styled(Box)`
  width: 100%;
  max-width: 580px;
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 28px;
  padding: 48px 40px;
  backdrop-filter: blur(24px);
  animation: ${fadeUp} 0.7s ease both;

  @media (max-width: 600px) { padding: 28px 18px; }
`;

const TopBar = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 32px;
`;

const AvatarSection = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 36px;
`;

const StyledAvatar = styled(Avatar)`
  width: 100px !important;
  height: 100px !important;
  font-size: 2.6rem !important;
  font-family: 'Palatino Linotype', serif !important;
  background: linear-gradient(135deg, #059669, #10b981) !important;
  border: 3px solid rgba(16,185,129,0.25) !important;
  margin-bottom: 16px;
  animation: ${glow} 3s ease-in-out infinite;
`;

const NameText = styled(Typography)`
  font-family: 'Palatino Linotype', serif !important;
  font-size: 1.85rem !important;
  font-weight: 700 !important;
  color: #ecfdf5 !important;
  letter-spacing: -0.3px !important;
`;

const RoleBadge = styled(Chip)`
  background: rgba(16,185,129,0.12) !important;
  border: 1px solid rgba(16,185,129,0.28) !important;
  color: #6ee7b7 !important;
  font-size: 0.72rem !important;
  font-weight: 700 !important;
  letter-spacing: 2px !important;
  text-transform: uppercase !important;
  margin-top: 8px !important;
  height: 26px !important;
`;

const GlowDivider = styled(Divider)`
  background: linear-gradient(90deg, transparent, rgba(16,185,129,0.2), transparent) !important;
  border: none !important;
  height: 1px !important;
  margin: 28px 0 !important;
`;

const SectionLabel = styled(Typography)`
  font-family: 'Palatino Linotype', serif !important;
  font-size: 0.68rem !important;
  font-weight: 700 !important;
  letter-spacing: 2.5px !important;
  text-transform: uppercase !important;
  color: #6ee7b7 !important;
  margin-bottom: 18px !important;
`;

const InfoRow = styled(Box)`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  transition: padding-left 0.2s;
  &:last-child { border-bottom: none; }
  &:hover { padding-left: 5px; }
`;

const IconBox = styled(Box)`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${({ bg }) => bg};
  border: 1px solid ${({ border }) => border};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: ${({ editing }) => editing ? '8px' : '3px'};
  svg { font-size: 17px; color: ${({ iconcolor }) => iconcolor}; }
`;

const FieldLabel = styled(Typography)`
  font-size: 0.68rem !important;
  color: #4b5563 !important;
  font-family: 'Palatino Linotype', serif !important;
  letter-spacing: 1.5px !important;
  text-transform: uppercase !important;
  margin-bottom: 2px !important;
`;

const FieldValue = styled(Typography)`
  font-size: 0.98rem !important;
  color: #d1fae5 !important;
  font-family: 'Palatino Linotype', serif !important;
  font-weight: 600 !important;
`;


const darkFieldSx = {
  flex: 1,
  '& .MuiOutlinedInput-root': {
    fontFamily: 'Palatino Linotype, serif',
    fontSize: '0.98rem',
    fontWeight: 600,
    color: '#d1fae5',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.03)',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.08)' },
    '&:hover fieldset': { borderColor: 'rgba(16,185,129,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#10b981' },
  },
  '& .MuiInputLabel-root': {
    fontFamily: 'Palatino Linotype, serif',
    color: '#4b5563',
    '&.Mui-focused': { color: '#6ee7b7' },
  },
};

const disabledFieldSx = {
  ...darkFieldSx,
  '& .MuiOutlinedInput-root': {
    ...darkFieldSx['& .MuiOutlinedInput-root'],
    color: '#4b5563',
    '& fieldset': { borderColor: 'rgba(255,255,255,0.04)' },
    '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.04)' },
  },
};

const SaveBtn = styled(Button)`
  background: linear-gradient(135deg, #059669, #10b981) !important;
  color: #fff !important;
  border-radius: 12px !important;
  font-family: 'Palatino Linotype', serif !important;
  font-weight: 700 !important;
  text-transform: none !important;
  font-size: 0.95rem !important;
  padding: 9px 28px !important;
  box-shadow: 0 4px 20px rgba(16,185,129,0.3) !important;
  &:hover { box-shadow: 0 6px 28px rgba(16,185,129,0.5) !important; }
`;

const CancelBtn = styled(Button)`
  color: #6b7280 !important;
  border: 1px solid rgba(255,255,255,0.07) !important;
  border-radius: 12px !important;
  font-family: 'Palatino Linotype', serif !important;
  font-weight: 600 !important;
  text-transform: none !important;
  font-size: 0.95rem !important;
  padding: 9px 20px !important;
  &:hover { background: rgba(255,255,255,0.05) !important; color: #d1d5db !important; }
`;

const iconBtnSx = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.07)',
  color: '#6b7280',
  borderRadius: '10px',
  '&:hover': { background: 'rgba(16,185,129,0.1)', color: '#6ee7b7' },
};

/* ─── Component ───────────────────────────────────────────── */
const TeacherProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  const teachSclass = currentUser?.teachSclass;
  const teachSubject = currentUser?.teachSubject;
  const teachSchool = currentUser?.school;

  const [editing, setEditing] = useState(false);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    password: '',
  });
  const [draft, setDraft] = useState(form);

  const handleEdit = () => { setDraft({ ...form, password: '' }); setEditing(true); };
  const handleCancel = () => { setDraft({ ...form, password: '' }); setEditing(false); };
  const handleChange = (key) => (e) => setDraft((p) => ({ ...p, [key]: e.target.value }));

  const handleSave = async () => {
    try {
      const payload = draft.password
        ? { name: draft.name, email: draft.email, password: draft.password }
        : { name: draft.name, email: draft.email };

      await axios.put(`/api/Teacher/${currentUser._id}`, payload);
      setForm({ ...draft, password: '' });
      setEditing(false);
      setSnack({ open: true, msg: 'Profile updated!', severity: 'success' });
    } catch {
      setSnack({ open: true, msg: 'Update failed. Try again.', severity: 'error' });
    }
  };

  const editableFields = [
    {
      key: 'name', label: 'Full Name', type: 'text',
      icon: <PersonIcon />, bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', iconcolor: '#6ee7b7',
    },
    {
      key: 'email', label: 'Email Address', type: 'email',
      icon: <EmailIcon />, bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)', iconcolor: '#a5b4fc',
    },
    ...(editing ? [{
      key: 'password', label: 'New Password', type: 'password',
      icon: <LockIcon />, bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', iconcolor: '#fca5a5',
    }] : []),
  ];

  const readonlyFields = [
    {
      label: 'Class',
      value: teachSclass?.sclassName || '—',
      icon: <ClassIcon />, bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', iconcolor: '#fcd34d',
    },
    {
      label: 'Subject',
      value: teachSubject?.subName || '—',
      icon: <MenuBookIcon />, bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.25)', iconcolor: '#f9a8d4',
    },
    {
      label: 'School',
      value: teachSchool?.schoolName || '—',
      icon: <SchoolIcon />, bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.22)', iconcolor: '#6ee7b7',
    },
  ];

  return (
    <PageWrapper>
      <Card>
        {/* Top bar */}
        <TopBar>
          {editing ? (
            <Tooltip title="Cancel">
              <IconButton size="small" onClick={handleCancel} sx={iconBtnSx}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Edit Profile">
              <IconButton size="small" onClick={handleEdit} sx={iconBtnSx}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </TopBar>

        {/* Avatar */}
        <AvatarSection>
          <StyledAvatar>{String(currentUser?.name ?? 'T').charAt(0)}</StyledAvatar>
          <NameText>{editing ? draft.name || currentUser?.name : currentUser?.name}</NameText>
          <RoleBadge label="Teacher" size="small" />
        </AvatarSection>

        <GlowDivider />

        {/* Editable fields */}
        <SectionLabel>Personal Details</SectionLabel>
        {editableFields.map((f) => (
          <InfoRow key={f.key}>
            <IconBox bg={f.bg} border={f.border} iconcolor={f.iconcolor} editing={editing ? 1 : 0}>
              {f.icon}
            </IconBox>
            {editing ? (
              <TextField
                label={f.label}
                type={f.type}
                value={draft[f.key]}
                onChange={handleChange(f.key)}
                variant="outlined"
                size="small"
                fullWidth
                placeholder={f.key === 'password' ? 'Leave blank to keep current' : ''}
                sx={darkFieldSx}
              />
            ) : (
              <Box>
                <FieldLabel>{f.label}</FieldLabel>
                <FieldValue>{f.key === 'password' ? '••••••••' : (form[f.key] || '—')}</FieldValue>
              </Box>
            )}
          </InfoRow>
        ))}

        <GlowDivider />

        {/* Read-only fields */}
        <SectionLabel>Assignment</SectionLabel>
        {readonlyFields.map((f) => (
          <InfoRow key={f.label}>
            <IconBox bg={f.bg} border={f.border} iconcolor={f.iconcolor}>
              {f.icon}
            </IconBox>
            {editing ? (
              <TextField
                label={f.label}
                value={f.value}
                variant="outlined"
                size="small"
                fullWidth
                disabled
                sx={disabledFieldSx}
                helperText="Managed by admin"
              />
            ) : (
              <Box>
                <FieldLabel>{f.label}</FieldLabel>
                <FieldValue>{f.value}</FieldValue>
              </Box>
            )}
          </InfoRow>
        ))}

        {/* Actions */}
        {editing && (
          <>
            <GlowDivider />
            <Box display="flex" justifyContent="flex-end" gap={1.5}>
              <CancelBtn onClick={handleCancel}>Cancel</CancelBtn>
              <SaveBtn startIcon={<SaveIcon />} onClick={handleSave}>Save Changes</SaveBtn>
            </Box>
          </>
        )}
      </Card>

      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((p) => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snack.severity} variant="filled"
          sx={{ fontFamily: 'Palatino Linotype, serif' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </PageWrapper>
  );
};

export default TeacherProfile;