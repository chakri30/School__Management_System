import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Box, Avatar, Typography, TextField, Button,
    Divider, Snackbar, Alert, IconButton, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SchoolIcon from '@mui/icons-material/School';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import axios from 'axios';
import { authLogout } from '../../redux/userRelated/userSlice';

/* ─── Animations ──────────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
  50%       { box-shadow: 0 0 0 12px rgba(99, 102, 241, 0); }
`;

/* ─── Styled Components ───────────────────────────────────── */
const PageWrapper = styled(Box)`
  min-height: 100vh;
  background: #0f0f13;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 16px;
  font-family: 'Crimson Text', Georgia, serif;

  &::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 40% at 70% 20%, rgba(99,102,241,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 40% 50% at 20% 80%, rgba(16,185,129,0.08) 0%, transparent 60%);
    pointer-events: none;
  }
`;

const Card = styled(Box)`
  width: 100%;
  max-width: 560px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 28px;
  padding: 48px 40px;
  backdrop-filter: blur(20px);
  position: relative;
  animation: ${fadeUp} 0.7s ease both;

  @media (max-width: 600px) {
    padding: 32px 20px;
  }
`;

const TopBar = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 32px;
`;

const AvatarWrap = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 36px;
`;

const StyledAvatar = styled(Avatar)`
  width: 96px !important;
  height: 96px !important;
  font-size: 2.4rem !important;
  font-family: 'Crimson Text', Georgia, serif !important;
  background: linear-gradient(135deg, #6366f1, #10b981) !important;
  border: 3px solid rgba(255,255,255,0.12) !important;
  margin-bottom: 16px;
  animation: ${pulse} 3s ease-in-out infinite;
`;

const Name = styled(Typography)`
  font-family: 'Crimson Text', Georgia, serif !important;
  font-size: 1.9rem !important;
  font-weight: 600 !important;
  color: #f1f5f9 !important;
  letter-spacing: -0.3px !important;
`;

const RoleBadge = styled(Box)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(99,102,241,0.15);
  border: 1px solid rgba(99,102,241,0.3);
  color: #a5b4fc;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  border-radius: 20px;
  padding: 4px 14px;
  margin-top: 8px;
`;

const GlowDivider = styled(Divider)`
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent) !important;
  border: none !important;
  height: 1px !important;
  margin: 28px 0 !important;
`;

const InfoRow = styled(Box)`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  transition: all 0.2s;

  &:last-child { border-bottom: none; }
  &:hover { padding-left: 4px; }
`;

const IconBox = styled(Box)`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${({ bg }) => bg || 'rgba(99,102,241,0.15)'};
  border: 1px solid ${({ border }) => border || 'rgba(99,102,241,0.25)'};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 4px;

  svg { font-size: 17px; color: ${({ iconcolor }) => iconcolor || '#a5b4fc'}; }
`;

const FieldLabel = styled(Typography)`
  font-size: 0.7rem !important;
  color: #64748b !important;
  font-family: 'Crimson Text', Georgia, serif !important;
  letter-spacing: 1.5px !important;
  text-transform: uppercase !important;
  margin-bottom: 2px !important;
`;

const FieldValue = styled(Typography)`
  font-size: 1rem !important;
  color: #e2e8f0 !important;
  font-family: 'Crimson Text', Georgia, serif !important;
  font-weight: 600 !important;
`;

const darkFieldSx = {
    flex: 1,
    '& .MuiOutlinedInput-root': {
        fontFamily: 'Crimson Text, Georgia, serif',
        fontSize: '1rem',
        fontWeight: 600,
        color: '#e2e8f0',
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.04)',
        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
        '&:hover fieldset': { borderColor: 'rgba(99,102,241,0.5)' },
        '&.Mui-focused fieldset': { borderColor: '#6366f1' },
    },
    '& .MuiInputLabel-root': {
        fontFamily: 'Crimson Text, Georgia, serif',
        color: '#64748b',
        '&.Mui-focused': { color: '#a5b4fc' },
    },
};

const ActionBtn = styled(Button)`
  border-radius: 12px !important;
  font-family: 'Crimson Text', Georgia, serif !important;
  font-weight: 600 !important;
  text-transform: none !important;
  font-size: 0.95rem !important;
`;

const SaveBtn = styled(ActionBtn)`
  background: linear-gradient(135deg, #6366f1, #4f46e5) !important;
  color: #fff !important;
  padding: 9px 28px !important;
  box-shadow: 0 4px 20px rgba(99,102,241,0.35) !important;
  &:hover { box-shadow: 0 6px 28px rgba(99,102,241,0.5) !important; }
`;

const CancelBtn = styled(ActionBtn)`
  color: #64748b !important;
  border: 1px solid rgba(255,255,255,0.08) !important;
  padding: 9px 20px !important;
  &:hover { background: rgba(255,255,255,0.05) !important; color: #e2e8f0 !important; }
`;

const DangerBtn = styled(ActionBtn)`
  color: #f87171 !important;
  border: 1px solid rgba(248,113,113,0.2) !important;
  padding: 9px 20px !important;
  &:hover { background: rgba(248,113,113,0.08) !important; }
`;

const iconBtnSx = (color = 'rgba(255,255,255,0.06)') => ({
    background: color,
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#94a3b8',
    borderRadius: '10px',
    '&:hover': { background: 'rgba(255,255,255,0.1)', color: '#f1f5f9' },
});

/* ─── Component ───────────────────────────────────────────── */
const AdminProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);

    const [editing, setEditing] = useState(false);
    const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });

    const [form, setForm] = useState({
        name: currentUser?.name || '',
        email: currentUser?.email || '',
        schoolName: currentUser?.schoolName || '',
        password: '',
    });
    const [draft, setDraft] = useState(form);

    const handleEdit = () => { setDraft({ ...form, password: '' }); setEditing(true); };
    const handleCancel = () => { setDraft({ ...form, password: '' }); setEditing(false); };

    const handleChange = (key) => (e) => setDraft((p) => ({ ...p, [key]: e.target.value }));

    const handleSave = async () => {
        try {
            const payload = draft.password
                ? { name: draft.name, email: draft.email, schoolName: draft.schoolName, password: draft.password }
                : { name: draft.name, email: draft.email, schoolName: draft.schoolName };

            await axios.put(`/api/Admin/${currentUser._id}`, payload);

            setForm({ ...draft, password: '' });
            setEditing(false);
            setSnack({ open: true, msg: 'Profile updated successfully!', severity: 'success' });
        } catch {
            setSnack({ open: true, msg: 'Failed to update profile.', severity: 'error' });
        }
    };

    const handleLogout = () => {
        dispatch(authLogout());
        navigate('/');
    };

    const fields = [
        {
            key: 'name', label: 'Full Name', type: 'text',
            icon: <PersonIcon />, bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)', iconcolor: '#a5b4fc',
        },
        {
            key: 'email', label: 'Email Address', type: 'email',
            icon: <EmailIcon />, bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.25)', iconcolor: '#6ee7b7',
        },
        {
            key: 'schoolName', label: 'School Name', type: 'text',
            icon: <SchoolIcon />, bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.25)', iconcolor: '#fcd34d',
        },
        ...(editing ? [{
            key: 'password', label: 'New Password', type: 'password',
            icon: <LockIcon />, bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.25)', iconcolor: '#fca5a5',
        }] : []),
    ];

    return (
        <PageWrapper>
            <Card>
                {/* Top action bar */}
                <TopBar>
                    {editing ? (
                        <Tooltip title="Cancel">
                            <IconButton size="small" onClick={handleCancel} sx={iconBtnSx()}>
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <Tooltip title="Edit Profile">
                            <IconButton size="small" onClick={handleEdit} sx={iconBtnSx()}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    )}
                    <Tooltip title="Logout">
                        <IconButton size="small" onClick={handleLogout} sx={iconBtnSx()}>
                            <LogoutIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </TopBar>

                {/* Avatar + identity */}
                <AvatarWrap>
                    <StyledAvatar>{String(currentUser?.name ?? 'A').charAt(0)}</StyledAvatar>
                    <Name>{editing ? draft.name || currentUser?.name : currentUser?.name}</Name>
                    <RoleBadge>
                        <SchoolIcon sx={{ fontSize: 13 }} />
                        Administrator
                    </RoleBadge>
                </AvatarWrap>

                <GlowDivider />

                {/* Fields */}
                <Box>
                    {fields.map((f) => (
                        <InfoRow key={f.key}>
                            <IconBox bg={f.bg} border={f.border} iconcolor={f.iconcolor}>
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
                                    <FieldValue>
                                        {f.key === 'password' ? '••••••••' : (form[f.key] || '—')}
                                    </FieldValue>
                                </Box>
                            )}
                        </InfoRow>
                    ))}
                </Box>

                {/* Save / Cancel row */}
                {editing && (
                    <>
                        <GlowDivider />
                        <Box display="flex" justifyContent="flex-end" gap={1.5}>
                            <CancelBtn onClick={handleCancel}>Cancel</CancelBtn>
                            <SaveBtn startIcon={<SaveIcon />} onClick={handleSave}>
                                Save Changes
                            </SaveBtn>
                        </Box>
                    </>
                )}

                {/* Danger zone */}
                {!editing && (
                    <>
                        <GlowDivider />
                        <Box display="flex" justifyContent="center">
                            <DangerBtn startIcon={<DeleteOutlineIcon />}>
                                Delete Account
                            </DangerBtn>
                        </Box>
                    </>
                )}
            </Card>

            {/* Snackbar */}
            <Snackbar
                open={snack.open}
                autoHideDuration={3500}
                onClose={() => setSnack((p) => ({ ...p, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snack.severity} variant="filled" sx={{ fontFamily: 'Crimson Text, Georgia, serif' }}>
                    {snack.msg}
                </Alert>
            </Snackbar>
        </PageWrapper>
    );
};

export default AdminProfile;