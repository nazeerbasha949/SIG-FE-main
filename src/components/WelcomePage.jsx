import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Button,
    useMediaQuery,
    useTheme,
    Divider,
    Paper
} from '@mui/material';
import {
    Dashboard,
    People,
    CreditCard,
    Link as LinkIcon,
    ConfirmationNumber,
    Notifications,
    TrendingUp,
    Lightbulb,
    Favorite,
    AccessTime,

} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';
import BaseUrl from '../Api';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
    const [userData, setUserData] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [greeting, setGreeting] = useState('');
    const [employeeStats, setEmployeeStats] = useState({
        total: 0,
        roleWise: {}
    });
    const [ticketStats, setTicketStats] = useState({
        Open: 0,
        Resolved: 0,
        Breached: 0
    });

    useEffect(() => {

        // Get user data from localStorage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            setUserData(JSON.parse(storedUserData));
        }

        // Update greeting based on time of day
        const hours = new Date().getHours();
        if (hours < 12) {
            setGreeting('Good Morning');
        } else if (hours < 18) {
            setGreeting('Good Afternoon');
        } else {
            setGreeting('Good Evening');
        }

        // Update time every minute
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    const floatVariants = {
        initial: { y: 0 },
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
            }
        }
    };

    const pulseVariants = {
        initial: { scale: 1 },
        animate: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
            }
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const [employeeResponse, ticketResponse] = await Promise.all([
                    axios.get(`${BaseUrl}/employees/count`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    axios.get(`${BaseUrl}/tickets/stats`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                setEmployeeStats(employeeResponse.data);
                setTicketStats({
                    Open: ticketResponse.data.open || 0,
                    Resolved: ticketResponse.data.resolved || 0,
                    Breached: ticketResponse.data.breached || 0
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, []);

    // Add isAdmin check
    const isAdmin = localStorage.getItem('isAdmin') === 'true';

    // Quick links data
    const quickLinks = [
        ...(isAdmin ? [{ icon: <People />, title: 'Employees', color: '#8b5cf6', path: '/employees' }] : []),
        { icon: <CreditCard />, title: 'Cards', color: '#ec4899', path: '/cards' },
        { icon: <LinkIcon />, title: 'Quick Links', color: '#10b981', path: '/quick-links' },
        { icon: <ConfirmationNumber />, title: 'Tickets', color: '#f59e0b', path: '/tickets' },
        // { icon: <Notifications />, title: 'Notifications', color: '#ef4444', path: '/notifications' }
    ];

    // Recent activities (mock data)
    const recentActivities = [
        { title: 'New employee onboarded', time: '2 hours ago', icon: <People />, color: '#8b5cf6' },
        { title: 'IT support ticket resolved', time: '4 hours ago', icon: <ConfirmationNumber />, color: '#f59e0b' },
        { title: 'Company meeting scheduled', time: 'Yesterday', icon: <AccessTime />, color: '#10b981' },
        { title: 'New announcement posted', time: '2 days ago', icon: <Notifications />, color: '#ef4444' }
    ];

    const rotateVariants = {
        initial: { rotate: 0 },
        animate: {
            rotate: 360,
            transition: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    const glowVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 0.5,
            transition: {
                duration: 20,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    const statsCardVariants = {
        initial: { y: 20, opacity: 0 },
        animate: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    }

    const bounceVariants = {
        initial: { y: 0 },
        animate: {
            y: [-10, 0, -10],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
            }
        }
    }

    // Stats cards data
    const statsCards = [
        {
            title: 'Employee Overview',
            value: employeeStats.total.toString(),
            subStats: [
                { label: 'DevOps', value: employeeStats.roleWise?.DevOps || 0 },
                { label: 'Developer', value: employeeStats.roleWise?.Developer || 0 },
                { label: 'HR', value: employeeStats.roleWise?.HR || 0 }
            ],
            icon: <People />,
            color: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            bgPattern: 'radial-gradient(circle at 90% 90%, rgba(255,255,255,0.1) 0%, transparent 50%)'
        },
        {
            title: 'Ticket Status',
            value: Object.values(ticketStats).reduce((a, b) => a + b, 0).toString(),
            subStats: [
                { label: 'Open', value: ticketStats.Open || 0 },
                { label: 'Resolved', value: ticketStats.Resolved || 0 },
                { label: 'Breached', value: ticketStats.Breached || 0 }
            ],
            icon: <ConfirmationNumber />,
            color: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
            bgPattern: 'radial-gradient(circle at 10% 10%, rgba(255,255,255,0.1) 0%, transparent 50%)'
        }
    ];

    return (
        <Box sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#f8fafc',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background Elements */}
            <motion.div
                variants={rotateVariants}
                initial="initial"
                animate="animate"
                style={{
                    position: 'fixed',
                    top: '-50%',
                    right: '-50%',
                    width: '150%',
                    height: '150%',
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
                    zIndex: 0,
                    filter: 'blur(60px)'
                }}
            />
            <motion.div
                variants={rotateVariants}
                initial="initial"
                animate="animate"
                style={{
                    position: 'fixed',
                    bottom: '-50%',
                    left: '-50%',
                    width: '150%',
                    height: '150%',
                    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.08) 0%, transparent 70%)',
                    zIndex: 0,
                    filter: 'blur(60px)'
                }}
            />

            <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4, position: 'relative', zIndex: 1 }}>
                {/* Enhanced Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    <Box sx={{
                        mb: 4,
                        p: { xs: 3, md: 4 },
                        borderRadius: 4,
                        // background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.95) 0%, rgba(59, 130, 246, 0.95) 100%)',
                        background: 'linear-gradient(135deg, #311188 0%, #0A081E 100%)',

                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 20px 40px -15px rgba(59, 130, 246, 0.3)',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        {/* Enhanced Decorative Elements */}
                        <motion.div
                            variants={glowVariants}
                            initial="initial"
                            animate="animate"
                            style={{
                                position: 'absolute',
                                top: '-150px',
                                right: '-150px',
                                width: '400px',
                                height: '400px',
                                background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                                borderRadius: '50%',
                                filter: 'blur(20px)',
                                zIndex: 0
                            }}
                        />

                        {/* Animated decorative elements */}
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                transition: { duration: 3, repeat: Infinity, repeatType: "reverse" }
                            }}
                            style={{
                                position: 'absolute',
                                top: -100,
                                right: -100,
                                width: 300,
                                height: 300,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                zIndex: 0
                            }}
                        />
                        <motion.div
                            animate={{
                                y: [0, -10, 0],
                                transition: { duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }
                            }}
                            style={{
                                position: 'absolute',
                                bottom: -80,
                                left: -80,
                                width: 200,
                                height: 200,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.1)',
                                zIndex: 0
                            }}
                        />

                        <Box sx={{ position: 'relative', zIndex: 1 }}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <Typography
                                    variant="h4"
                                    fontWeight="bold"
                                    gutterBottom
                                    sx={{
                                        fontSize: { xs: '1.75rem', md: '2.5rem' },
                                        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1
                                    }}
                                >
                                    {greeting},
                                    <motion.span
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                        style={{
                                            background: 'linear-gradient(to right, #fff, #e0e7ff)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent'
                                        }}
                                    >
                                        {userData?.name || 'User'}!
                                    </motion.span>
                                </Typography>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Typography
                                    variant="body1"
                                    sx={{
                                        opacity: 0.9,
                                        mb: 2,
                                        fontSize: { xs: '0.875rem', md: '1rem' }
                                    }}
                                >
                                    {currentTime.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </Typography>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        maxWidth: '800px',
                                        fontSize: { xs: '1rem', md: '1.25rem' },
                                        lineHeight: 1.6
                                    }}
                                >
                                    Welcome to your Signavox portal. Access all your company resources,
                                    information, and tools in one place.
                                </Typography>
                            </motion.div>
                        </Box>
                    </Box>
                </motion.div>

                {/* Enhanced Quick Access Links */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >

                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{
                            mb: 6,
                            color: '#1e293b',
                            fontSize: { xs: '1.75rem', md: '2.25rem' },
                            position: 'relative',
                            display: 'inline-block',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -12,
                                left: 0,
                                width: '100%',
                                height: 3,
                                background: 'linear-gradient(to right, #3b82f6, transparent)',
                                borderRadius: 2
                            }
                        }}
                        className="tracking-tight"
                    >
                        Quick Access
                    </Typography>
                </motion.div>

                {/* Enhanced Grid Layout for Quick Access */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ staggerChildren: 0.1, delayChildren: 0.4 }}
                >
                    <Box sx={{
                        overflowX: 'auto',
                        mb: 8,
                        pb: 2,
                        '&::-webkit-scrollbar': {
                            height: 8
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f5f9'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#94a3b8',
                            borderRadius: 4
                        }
                    }}>
                        <Grid
                            container
                            sx={{
                                flexWrap: 'nowrap',
                                width: 'max-content',
                                gap: 3
                            }}
                        >
                            {quickLinks.map((link, index) => (
                                <Grid item key={index} sx={{ width: { xs: '220px', md: '250px' } }}>
                                    <motion.div
                                        variants={itemVariants}
                                        whileHover={{
                                            scale: 1.02,
                                            transition: { duration: 0.2 }
                                        }}
                                    >
                                        <Paper
                                            elevation={0}
                                            onClick={() => navigate(link.path)}
                                            sx={{
                                                p: { xs: 3, md: 4 },
                                                borderRadius: 4,
                                                textAlign: 'center',
                                                height: { xs: '180px', md: '200px' },
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                border: '1px solid',
                                                borderColor: 'rgba(0,0,0,0.05)',
                                                transition: 'all 0.3s ease',
                                                background: `linear-gradient(135deg, ${link.color}08, white)`,
                                                backdropFilter: 'blur(8px)',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                '&:hover': {
                                                    boxShadow: `0 15px 30px -10px ${link.color}30`,
                                                    borderColor: `${link.color}40`,
                                                    background: `linear-gradient(135deg, ${link.color}15, white)`,
                                                    transform: 'translateY(-4px)'
                                                },
                                                '&::before': {
                                                    content: '""',
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: 4,
                                                    background: link.color,
                                                    opacity: 0.7
                                                }
                                            }}
                                        >
                                            <motion.div
                                                whileHover={{
                                                    rotate: [0, -10, 10, 0],
                                                    scale: 1.1
                                                }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <Avatar
                                                    sx={{
                                                        bgcolor: `${link.color}15`,
                                                        color: link.color,
                                                        width: { xs: 56, md: 64 },
                                                        height: { xs: 56, md: 64 },
                                                        mb: 2,
                                                        boxShadow: `0 8px 16px -6px ${link.color}30`,
                                                        '& .MuiSvgIcon-root': {
                                                            fontSize: { xs: '1.75rem', md: '2rem' }
                                                        }
                                                    }}
                                                >
                                                    {link.icon}
                                                </Avatar>
                                            </motion.div>
                                            <Typography
                                                variant="h6"
                                                fontWeight="bold"
                                                sx={{
                                                    fontSize: { xs: '1rem', md: '1.125rem' },
                                                    color: '#1e293b'
                                                }}
                                            >
                                                {link.title}
                                            </Typography>
                                        </Paper>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </motion.div>

                {/* Overview Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                        sx={{
                            mb: 6,
                            color: '#1e293b',
                            fontSize: { xs: '1.75rem', md: '2.25rem' },
                            position: 'relative',
                            display: 'inline-block',
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -12,
                                left: 0,
                                width: '100%',
                                height: 3,
                                background: 'linear-gradient(to right, #3b82f6, transparent)',
                                borderRadius: 2
                            }
                        }}
                        className="tracking-tight"
                    >
                        Overview
                    </Typography>
                </motion.div>

                {/* Stats Cards Section */}
                <Box sx={{ mb: 8 }}>
                    <Box sx={{
                        overflowX: 'auto',
                        pb: 2,
                        '&::-webkit-scrollbar': {
                            height: 8
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f5f9'
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#94a3b8',
                            borderRadius: 4
                        }
                    }}>
                        {/* <Grid
                            container
                            sx={{
                                flexWrap: 'nowrap',
                                width: 'max-content',
                                gap: 3
                            }}
                        >
                            {statsCards.map((card, index) => (
                                <Grid item key={index} sx={{ width: { xs: '250px', md: '280px' } }}>
                                    <motion.div
                                        variants={itemVariants}
                                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                    >
                                        <Card
                                            elevation={0}
                                            sx={{
                                                borderRadius: 4,
                                                height: { xs: '160px', md: '180px' },
                                                border: '1px solid',
                                                borderColor: 'rgba(0,0,0,0.05)',
                                                background: 'rgba(255,255,255,0.8)',
                                                backdropFilter: 'blur(10px)',
                                                position: 'relative',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    boxShadow: '0 20px 40px -12px rgba(0,0,0,0.15)',
                                                    transform: 'translateY(-5px)'
                                                }
                                            }}
                                        >
                                            <Box sx={{ background: card.color, height: 4 }} />
                                            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <Box>
                                                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, fontSize: { xs: '1.75rem', md: '2rem' } }}>
                                                            {card.value}
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: { xs: '0.875rem', md: '1rem' } }}>
                                                            {card.title}
                                                        </Typography>
                                                    </Box>
                                                    <Avatar
                                                        sx={{
                                                            width: { xs: 48, md: 56 },
                                                            height: { xs: 48, md: 56 },
                                                            background: 'rgba(255,255,255,0.9)',
                                                            color: '#6366f1',
                                                            boxShadow: '0 8px 16px -6px rgba(99,102,241,0.3)',
                                                            '& .MuiSvgIcon-root': {
                                                                fontSize: { xs: '1.5rem', md: '1.75rem' }
                                                            }
                                                        }}
                                                    >
                                                        {card.icon}
                                                    </Avatar>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid> */}
                        {/* <Grid container spacing={4}>
                            {statsCards.map((card, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: 4,
                                            background: card.color,
                                            color: 'white',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <Avatar
                                                sx={{
                                                    bgcolor: 'rgba(255,255,255,0.2)',
                                                    mr: 2
                                                }}
                                            >
                                                {card.icon}
                                            </Avatar>
                                            <Typography variant="h6">{card.title}</Typography>
                                        </Box>
                                        <Typography variant="h3" sx={{ mb: 2 }}>
                                            {card.value}
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {card.subStats.map((stat, i) => (
                                                <Grid item xs={4} key={i}>
                                                    <Box sx={{ textAlign: 'center' }}>
                                                        <Typography variant="h5">
                                                            {stat.value}
                                                        </Typography>
                                                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                                            {stat.label}
                                                        </Typography>
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid> */}
                        {/* Stats Cards Grid */}
                        <Grid container spacing={4} sx={{ mb: { xs: 6, md: 8 } }}>
                            {statsCards.map((card, index) => (
                                <Grid item xs={12} md={6} key={index}>
                                    <motion.div
                                        variants={bounceVariants}
                                        initial="initial"
                                        animate="animate"
                                        whileHover={{
                                            scale: 1.02,
                                            transition: { duration: 0.2 }
                                        }}
                                    >
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                height: { xs: '300px', md: '350px' }, // Reduced from 400px/450px
                                                p: { xs: 3, md: 4 }, // Reduced padding
                                                borderRadius: 6,
                                                background: `${card.color}, ${card.bgPattern}`,
                                                color: 'white',
                                                position: 'relative',
                                                overflow: 'hidden',
                                                backdropFilter: 'blur(10px)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                transition: 'all 0.3s ease-in-out',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                '&:hover': {
                                                    transform: 'translateY(-8px)',
                                                    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                                                    '& .icon-container': {
                                                        // transform: 'scale(1.1) rotate(10deg)'
                                                    }
                                                }
                                            }}
                                        >
                                            <Box
                                                className="icon-container"
                                                sx={{
                                                    width: { xs: 60, md: 80 }, // Reduced from 80/100
                                                    height: { xs: 60, md: 80 }, // Reduced from 80/100
                                                    borderRadius: '50%',
                                                    bgcolor: 'rgba(255,255,255,0.2)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    mb: 3, // Reduced margin
                                                    transition: 'all 0.3s ease',
                                                    '& svg': {
                                                        fontSize: { xs: 30, md: 40 }, // Reduced from 40/50
                                                        color: 'white'
                                                    }
                                                }}
                                            >
                                                {card.icon}
                                            </Box>

                                            <Typography
                                                variant="h4"
                                                fontWeight="bold"
                                                sx={{
                                                    mb: 1.5, // Reduced margin
                                                    fontSize: { xs: '1.5rem', md: '2rem' }, // Reduced from 1.75rem/2.25rem
                                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}
                                            >
                                                {card.title}
                                            </Typography>

                                            <Typography
                                                variant="h2"
                                                sx={{
                                                    mb: 3, // Reduced margin
                                                    fontSize: { xs: '2.5rem', md: '3.5rem' }, // Reduced from 3rem/4rem
                                                    fontWeight: 'bold',
                                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                }}
                                            >
                                                {card.value}
                                            </Typography>

                                            <Grid container spacing={2} sx={{ mt: 'auto' }}>
                                                {card.subStats.map((stat, i) => (
                                                    <Grid item xs={4} key={i}>
                                                        <Box
                                                            sx={{
                                                                p: { xs: 1.5, md: 2 }, // Reduced padding
                                                                borderRadius: 4,
                                                                bgcolor: 'rgba(255,255,255,0.1)',
                                                                backdropFilter: 'blur(5px)',
                                                                textAlign: 'center',
                                                                transition: 'all 0.3s ease',
                                                                '&:hover': {
                                                                    transform: 'translateY(-4px)',
                                                                    bgcolor: 'rgba(255,255,255,0.15)'
                                                                }
                                                            }}
                                                        >
                                                            <Typography
                                                                variant="h4"
                                                                fontWeight="bold"
                                                                sx={{
                                                                    mb: 0.5, // Reduced margin
                                                                    fontSize: { xs: '1.25rem', md: '1.75rem' } // Reduced from 1.5rem/2rem
                                                                }}
                                                            >
                                                                {stat.value}
                                                            </Typography>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    opacity: 0.9,
                                                                    fontSize: { xs: '0.75rem', md: '0.875rem' } // Reduced from 0.875rem/1rem
                                                                }}
                                                            >
                                                                {stat.label}
                                                            </Typography>
                                                        </Box>
                                                    </Grid>
                                                ))}
                                            </Grid>
                                        </Paper>
                                    </motion.div>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Box>

                {/* Recent Activities with enhanced animations */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                >
                    <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#1e293b' }}>
                        Recent Activities
                    </Typography>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <Grid container spacing={3}>
                        {recentActivities.map((activity, index) => (
                            <Grid item xs={12} sm={6} md={3} key={index}>
                                <motion.div
                                    variants={itemVariants}
                                    whileHover={{
                                        x: 5,
                                        transition: { duration: 0.2 }
                                    }}
                                >
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            borderRadius: 4,
                                            display: 'flex',
                                            alignItems: 'center',
                                            border: '1px solid',
                                            borderColor: 'rgba(0,0,0,0.05)',
                                            transition: 'all 0.3s ease',
                                            '&:hover': {
                                                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                                borderColor: `${activity.color}40`,
                                                background: `linear-gradient(135deg, ${activity.color}05, white)`,
                                            }
                                        }}
                                    >
                                        <Avatar
                                            sx={{
                                                bgcolor: `${activity.color}20`,
                                                color: activity.color,
                                                width: 48,
                                                height: 48,
                                                mr: 2
                                            }}
                                        >
                                            {activity.icon}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="medium">
                                                {activity.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {activity.time}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </motion.div>
            </Container>

        </Box>

    );
};

export default WelcomePage;


