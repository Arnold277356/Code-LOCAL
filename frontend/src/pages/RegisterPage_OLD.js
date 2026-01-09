import React, { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import { FaCamera, FaUpload, FaCheckCircle, FaVideo } from 'react-icons/fa';
import './RegisterPage.css';

function RegisterPage() {
  const [formData, setFormData] = useState({
    // E-waste fields
    first_name: '',
    middle_name: '',
    last_name: '',
    suffix: '',
    address: '',
    age: '',
    contact: '',
    e_waste_type: '',
    weight: '',
    photo_url: '',
    consent: false,
    // User credentials
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    security_question: 'What is your mother\'s name?',
    security_answer: ''
  });

  const [photoPreview, setPhotoPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef(null);

  const securityQuestions = [
    'What is your mother\'s name?',
    'What is your pet\'s name?',
    'What is your favorite color?',
    'What is your favorite food?',
    'What city were you born in?',
    'What is your favorite movie?',
    'What is your favorite book?',
    'What is your favorite sports team?'
  ];

  const eWasteTypes = [
    'Desktop Computer',
    'Laptop',
    'Smartphone',
    'Tablet',
    'Monitor',
    'Keyboard/Mouse',
    'Cables & Chargers',
    'CPU/Processor',
    'Motherboard',
    'RAM',
    'Hard Drive',
    'Power Supply',
    'Printer',
    'Scanner',
    'Television',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let finalValue = type === 'checkbox' ? checked : value;

    // Validation for name fields - only letters and spaces
    if (['first_name', 'last_name'].includes(name)) {
      finalValue = value.replace(/[^a-zA-Z\s]/g, '');
    }

    // Validation for middle name - only letters and spaces
    if (name === 'middle_name') {
      finalValue = value.replace(/[^a-zA-Z\s]/g, '');
    }

    // Validation for suffix - only letters and spaces
    if (name === 'suffix') {
      finalValue = value.replace(/[^a-zA-Z\s.]/g, '');
    }

    // Validation for address - NO numbers or special characters (letters, spaces, hyphens, commas only)
    if (name === 'address') {
      finalValue = value.replace(/[^a-zA-Z\s,\-]/g, '');
    }

    // Validation for age - only 2 digits (18-99)
    if (name === 'age') {
      finalValue = value.replace(/[^0-9]/g, '').slice(0, 2);
    }

    // Validation for contact - only 11 digits
    if (name === 'contact') {
      finalValue = value.replace(/[^0-9]/g, '').slice(0, 11);
    }

    // Validation for username - alphanumeric and underscore only
    if (name === 'username') {
      finalValue = value.replace(/[^a-zA-Z0-9_]/g, '').slice(0, 20);
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
    setError('');
  };

  // Resize image to 2x2 (200x200px for ID photo)
  const resizeImage = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, 200, 200);
        canvas.toBlob(callback, 'image/jpeg', 0.9);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please upload an image file (PNG, JPG, GIF)',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Please upload an image smaller than 5MB',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    setUploading(true);

    try {
      // Resize image to 200x200 (2x2 ID photo size)
      resizeImage(file, async (resizedBlob) => {
        try {
          const formDataCloud = new FormData();
          formDataCloud.append('file', resizedBlob);
          formDataCloud.append('upload_preset', 'ecyclehub_preset');

          const response = await fetch(
            'https://api.cloudinary.com/v1_1/dtr1tnutd/image/upload',
            {
              method: 'POST',
              body: formDataCloud
            }
          );

          if (response.ok) {
            const data = await response.json();
            setFormData(prev => ({
              ...prev,
              photo_url: data.secure_url
            }));
            setPhotoPreview(data.secure_url);
            setShowCamera(false);
            setUploading(false);

            Swal.fire({
              icon: 'success',
              title: '✓ Photo Uploaded Successfully!',
              html: `
                <div style="text-align: center;">
                  <p style="font-size: 14px; color: #666;">Your 2x2 photo has been uploaded</p>
                  <p style="font-size: 12px; color: #999; margin-top: 8px;">You can now submit your registration</p>
                </div>
              `,
              confirmButtonColor: '#10b981',
              confirmButtonText: 'Continue',
              timer: 2000
            });
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Upload failed');
          }
        } catch (err) {
          console.error('Photo upload error:', err);
          Swal.fire({
            icon: 'error',
            title: 'Upload Failed',
            html: `
              <div style="text-align: center;">
                <p style="font-size: 14px; color: #666;">Failed to upload photo</p>
                <p style="font-size: 12px; color: #999; margin-top: 8px;">${err.message}</p>
                <p style="font-size: 12px; color: #999; margin-top: 8px;">Please try again</p>
              </div>
            `,
            confirmButtonColor: '#10b981'
          });
          setUploading(false);
        }
      });
    } catch (err) {
      console.error('Photo upload error:', err);
      setUploading(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Camera Error',
        text: 'Could not access camera. Please check permissions.',
        confirmButtonColor: '#10b981'
      });
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      try {
        const context = canvasRef.current.getContext('2d');
        const video = videoRef.current;
        
        // Draw video frame to canvas (200x200)
        context.drawImage(video, 0, 0, 200, 200);
        
        canvasRef.current.toBlob(async (blob) => {
          if (!blob) {
            Swal.fire({
              icon: 'error',
              title: 'Capture Failed',
              text: 'Could not capture photo. Please try again.',
              confirmButtonColor: '#10b981'
            });
            return;
          }

          const formDataCloud = new FormData();
          formDataCloud.append('file', blob);
          formDataCloud.append('upload_preset', 'ecyclehub_preset');

          setUploading(true);
          try {
            const response = await fetch(
              'https://api.cloudinary.com/v1_1/dtr1tnutd/image/upload',
              {
                method: 'POST',
                body: formDataCloud
              }
            );

            if (response.ok) {
              const data = await response.json();
              setFormData(prev => ({
                ...prev,
                photo_url: data.secure_url
              }));
              setPhotoPreview(data.secure_url);
              stopCamera();
              setUploading(false);

              Swal.fire({
                icon: 'success',
                title: '✓ Photo Captured Successfully!',
                html: `
                  <div style="text-align: center;">
                    <p style="font-size: 14px; color: #666;">Your 2x2 photo has been captured and uploaded</p>
                  </div>
                `,
                confirmButtonColor: '#10b981',
                timer: 2000
              });
            } else {
              const errorData = await response.json();
              throw new Error(errorData.error?.message || 'Upload failed');
            }
          } catch (err) {
            console.error('Camera upload error:', err);
            Swal.fire({
              icon: 'error',
              title: 'Upload Failed',
              text: err.message,
              confirmButtonColor: '#10b981'
            });
            setUploading(false);
          }
        }, 'image/jpeg', 0.9);
      } catch (err) {
        console.error('Capture error:', err);
        Swal.fire({
          icon: 'error',
          title: 'Capture Error',
          text: 'Could not capture photo. Please try again.',
          confirmButtonColor: '#10b981'
        });
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      setShowCamera(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation for first name
    if (!formData.first_name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'First Name Required',
        text: 'Please enter your first name',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    // Validation for last name
    if (!formData.last_name.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Last Name Required',
        text: 'Please enter your last name',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    // Validation for address
    if (!formData.address.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Address Required',
        text: 'Please enter your address (letters and spaces only)',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    // Validation for address - no numbers
    if (/[0-9]/.test(formData.address)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Address',
        text: 'Address cannot contain numbers',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    // Validation for age
    if (!formData.age || formData.age < 18 || formData.age > 99) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Age',
        text: 'Please enter a valid age (18-99)',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    // Validation for contact
    if (!formData.contact || formData.contact.length !== 11) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Contact Number',
        text: 'Please enter a valid 11-digit contact number',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    // Validation for e-waste type
    if (!formData.e_waste_type) {
      Swal.fire({
        icon: 'warning',
        title: 'E-Waste Type Required',
        text: 'Please select the type of e-waste',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    // Validation for weight
    if (!formData.weight || formData.weight <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Weight',
        text: 'Please enter a valid weight (greater than 0 kg)',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    // Validation for photo
    if (!formData.photo_url) {
      Swal.fire({
        icon: 'warning',
        title: 'Photo Required',
        text: 'Please upload a photo',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    // Validation for consent
    if (!formData.consent) {
      Swal.fire({
        icon: 'warning',
        title: 'Consent Required',
        text: 'You must agree to the terms and conditions',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    // ========== USER CREDENTIALS VALIDATION ==========

    // Validation for username
    if (!formData.username.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Username Required',
        text: 'Please enter a username (3-20 characters)',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    if (formData.username.length < 3 || formData.username.length > 20) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Username',
        text: 'Username must be 3-20 characters',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    // Validation for email
    if (!formData.email.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Email Required',
        text: 'Please enter your email address',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Email',
        text: 'Please enter a valid email address',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    // Validation for password
    if (!formData.password) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Required',
        text: 'Please enter a password (minimum 6 characters)',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    if (formData.password.length < 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Weak Password',
        text: 'Password must be at least 6 characters',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    // Validation for confirm password
    if (!formData.confirm_password) {
      Swal.fire({
        icon: 'warning',
        title: 'Confirm Password Required',
        text: 'Please confirm your password',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    if (formData.password !== formData.confirm_password) {
      Swal.fire({
        icon: 'warning',
        title: 'Passwords Do Not Match',
        text: 'Password and confirm password must match',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    // Validation for security answer
    if (!formData.security_answer.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Security Answer Required',
        text: 'Please answer the security question',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    if (formData.security_answer.trim().length < 2) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Security Answer',
        text: 'Security answer must be at least 2 characters',
        confirmButtonColor: '#10b981'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const reward = formData.weight * 15;
        const fullName = `${formData.first_name} ${formData.middle_name ? formData.middle_name + ' ' : ''}${formData.last_name}${formData.suffix ? ' ' + formData.suffix : ''}`;
        
        Swal.fire({
          icon: 'success',
          title: '✓ Registration Successful!',
          html: `
            <div style="text-align: center;">
              <p style="font-size: 16px; margin: 10px 0;">Thank you for your e-waste drop-off, <strong>${formData.first_name}</strong>!</p>
              <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p style="margin: 8px 0;"><strong>Name:</strong> ${fullName}</p>
                <p style="margin: 8px 0;"><strong>E-Waste Type:</strong> ${formData.e_waste_type}</p>
                <p style="margin: 8px 0;"><strong>Weight:</strong> ${formData.weight} kg</p>
                <p style="margin: 8px 0; font-size: 18px; color: #10b981;"><strong>Reward: ₱${reward.toFixed(2)}</strong></p>
              </div>
              <p style="font-size: 14px; color: #666;">Your contribution helps protect the environment!</p>
            </div>
          `,
          confirmButtonColor: '#10b981',
          confirmButtonText: 'Great!'
        });
        
        setFormData({
          first_name: '',
          middle_name: '',
          last_name: '',
          suffix: '',
          address: '',
          age: '',
          contact: '',
          e_waste_type: '',
          weight: '',
          photo_url: '',
          consent: false
        });
        setPhotoPreview('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Submission Failed',
          text: 'Failed to submit registration. Please try again.',
          confirmButtonColor: '#10b981',
          confirmButtonText: 'OK'
        });
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Connection Error',
        text: 'Error submitting form. Please check your connection and try again.',
        confirmButtonColor: '#10b981',
        confirmButtonText: 'OK'
      });
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 text-white py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Register Your E-Waste Drop-off</h1>
          <p className="text-emerald-100 text-lg">Professional registration form with photo upload</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Photo Upload Section */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border-2 border-emerald-200">
              <label className="block text-lg font-bold text-gray-900 mb-4">
                <FaCamera className="inline mr-2 text-emerald-600" />
                Upload Your 2x2 Photo *
              </label>
              
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Photo Preview */}
                <div className="flex-shrink-0">
                  <div className="w-40 h-40 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-emerald-300">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <FaCamera className="text-5xl text-gray-400 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">No photo</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload & Camera Options */}
                <div className="flex-1">
                  {!showCamera ? (
                    <div className="space-y-3">
                      <input
                        type="file"
                        ref={fileInputRef}
                        id="photo"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                      <label htmlFor="photo" className="block">
                        <div className="border-2 border-dashed border-emerald-400 rounded-lg p-6 text-center cursor-pointer hover:bg-emerald-50 transition-colors">
                          <FaUpload className="text-3xl text-emerald-600 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-gray-900">Click to upload photo</p>
                          <p className="text-xs text-gray-600 mt-1">PNG, JPG, GIF up to 5MB</p>
                        </div>
                      </label>
                      <button
                        type="button"
                        onClick={startCamera}
                        disabled={uploading}
                        className="w-full py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <FaVideo /> Take Photo with Camera
                      </button>
                      {uploading && <p className="text-sm text-emerald-600">Uploading...</p>}
                      {formData.photo_url && <p className="text-sm text-emerald-600">✓ Photo uploaded (200x200px)</p>}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full rounded-lg border-2 border-emerald-400"
                        style={{ maxHeight: '300px' }}
                      />
                      <canvas ref={canvasRef} width="200" height="200" className="hidden" />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={capturePhoto}
                          disabled={uploading}
                          className="flex-1 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          Capture Photo
                        </button>
                        <button
                          type="button"
                          onClick={stopCamera}
                          className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Juan"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Middle Name</label>
                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleChange}
                  placeholder="Dela"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Cruz"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Suffix</label>
                <input
                  type="text"
                  name="suffix"
                  value={formData.suffix}
                  onChange={handleChange}
                  placeholder="Jr., Sr., III"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street, Burol 1, Dasmariñas Cavite"
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all"
                required
              />
            </div>

            {/* Age and Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Age (18-99) *</label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="25"
                  maxLength="2"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number (11 digits) *</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  placeholder="09123456789"
                  maxLength="11"
                  className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all"
                  required
                />
              </div>
            </div>

            {/* E-Waste Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Type of E-Waste *</label>
              <select
                name="e_waste_type"
                value={formData.e_waste_type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all"
                required
              >
                <option value="">-- Select e-waste type --</option>
                {eWasteTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Approximate Weight (kg) *</label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="5.5"
                step="0.1"
                min="0"
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 transition-all"
                required
              />
            </div>

            {/* Consent */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 text-emerald-600 rounded"
                  required
                />
                <span className="text-sm text-gray-700">
                  I consent to the collection and processing of my e-waste and agree to the terms and conditions *
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-bold rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:from-emerald-700 hover:to-green-700"
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-emerald-50 border-l-4 border-emerald-600 rounded">
            <p className="text-sm text-emerald-900">
              <strong>ℹ️ Note:</strong> Your information will be kept confidential and used only for e-waste collection purposes. We appreciate your contribution to environmental sustainability!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
