// tests/authController.test.js
const {
  register,
  verifyEmail,
  login,
  forgetpassword,
  resetPassword,
  logout,
  contactUs,
} = require('../src/controllers/authController');

// Mocks
jest.mock('../src/models/User');
jest.mock('../src/config/mailer');
jest.mock('../src/util/generateToken');

const User           = require('../src/models/User');
const { sendEmail }  = require('../src/config/mailer');
const { generateToken } = require('../src/util/generateToken');

//  req / res factory 
const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

const mockReq = (body = {}, headers = {}) => ({
  body,
  headers: { 'user-agent': 'Jest/Test', ...headers },
  files: {},
});

// register
describe('register', () => {
  beforeEach(() => jest.clearAllMocks());

  it('يرجع 400 لو الإيميل موجود قبل كده', async () => {
    User.findOne.mockResolvedValue({ email: 'test@test.com' });

    const req = mockReq({ username: 'Ali', email: 'test@test.com', password: '123456' });
    const res = mockRes();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'هذا البريد الإلكتروني مستخدم بالفعل' })
    );
  });

  it('يرجع 500 لو الإيميل فشل في الإرسال', async () => {
    User.findOne.mockResolvedValue(null);
    sendEmail.mockRejectedValue(new Error('SMTP Error'));

    const mockUser = { save: jest.fn() };
    User.mockImplementation(() => mockUser);

    const req = mockReq({ username: 'Ali', email: 'new@test.com', password: '123456', phone: '01012345678', gender: 'male' });
    const res = mockRes();

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('يرجع 201 ويبعت إيميل لو كل حاجة تمام', async () => {
    User.findOne.mockResolvedValue(null);
    sendEmail.mockResolvedValue(true);

    const mockUser = { save: jest.fn().mockResolvedValue(true) };
    User.mockImplementation(() => mockUser);

    const req = mockReq({ username: 'Ali', email: 'new@test.com', password: '123456', phone: '01012345678', gender: 'male' });
    const res = mockRes();

    await register(req, res);

    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });
});

// verifyEmail
describe('verifyEmail', () => {
  beforeEach(() => jest.clearAllMocks());

  it('يرجع 400 لو الـ OTP غلط أو منتهي', async () => {
    User.findOne.mockResolvedValue(null);

    const req = mockReq({ otp: '000000' });
    const res = mockRes();

    await verifyEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'كود التحقق غير صحيح أو انتهت صلاحيته' })
    );
  });

  it('يرجع 200 ويفعّل الحساب لو الـ OTP صح', async () => {
    const mockUser = {
      isVerified:  false,
      otp:         '123456',
      otpExpire:   undefined,
      save:        jest.fn().mockResolvedValue(true),
    };
    User.findOne.mockResolvedValue(mockUser);

    const req = mockReq({ otp: '123456' });
    const res = mockRes();

    await verifyEmail(req, res);

    expect(mockUser.isVerified).toBe(true);
    expect(mockUser.otp).toBeUndefined();
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

// login
describe('login', () => {
  beforeEach(() => jest.clearAllMocks());

  it('يرجع 401 لو المستخدم مش موجود', async () => {
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

    const req = mockReq({ email: 'notfound@test.com', password: '123456' });
    const res = mockRes();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' })
    );
  });

  it('يرجع 401 لو كلمة المرور غلط', async () => {
    const mockUser = {
      comparePassword: jest.fn().mockResolvedValue(false),
      isVerified: true,
    };
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

    const req = mockReq({ email: 'test@test.com', password: 'wrongpass' });
    const res = mockRes();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('يرجع 401 لو الحساب مش متفعّل', async () => {
    const mockUser = {
      comparePassword: jest.fn().mockResolvedValue(true),
      isVerified: false,
    };
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });

    const req = mockReq({ email: 'test@test.com', password: '123456' });
    const res = mockRes();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'يرجى تفعيل البريد الإلكتروني أولاً' })
    );
  });

  it('يرجع 200 والـ token لو كل حاجة تمام', async () => {
    const mockUser = {
      comparePassword: jest.fn().mockResolvedValue(true),
      isVerified:      true,
      password:        '123456',
    };
    User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(mockUser) });
    generateToken.mockResolvedValue('mocked_token');

    const req = mockReq({ email: 'test@test.com', password: '123456' });
    const res = mockRes();

    await login(req, res);

    expect(generateToken).toHaveBeenCalledWith(mockUser, 'Jest/Test');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ accessToken: 'mocked_token' }),
      })
    );
    expect(mockUser.password).toBeUndefined();
  });
});

// forgetpassword
describe('forgetpassword', () => {
  beforeEach(() => jest.clearAllMocks());

  it('يرجع 404 لو الإيميل مش موجود', async () => {
    User.findOne.mockResolvedValue(null);

    const req = mockReq({ email: 'notfound@test.com' });
    const res = mockRes();

    await forgetpassword(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'البريد الإلكتروني غير موجود' })
    );
  });

  it('يرجع 200 ويبعت OTP لو الإيميل موجود', async () => {
    const mockUser = {
      save: jest.fn().mockResolvedValue(true),
      resetPasswordOtp:       undefined,
      resetPasswordOtpExpire: undefined,
    };
    User.findOne.mockResolvedValue(mockUser);
    sendEmail.mockResolvedValue(true);

    const req = mockReq({ email: 'test@test.com' });
    const res = mockRes();

    await forgetpassword(req, res);

    expect(mockUser.resetPasswordOtp).toBeDefined();
    expect(sendEmail).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('يرجع 500 ويمسح الـ OTP لو الإيميل فشل', async () => {
    const mockUser = {
      save:                   jest.fn().mockResolvedValue(true),
      resetPasswordOtp:       undefined,
      resetPasswordOtpExpire: undefined,
    };
    User.findOne.mockResolvedValue(mockUser);
    sendEmail.mockRejectedValue(new Error('SMTP Error'));

    const req = mockReq({ email: 'test@test.com' });
    const res = mockRes();

    await forgetpassword(req, res);

    expect(mockUser.resetPasswordOtp).toBeUndefined();
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// resetPassword
describe('resetPassword', () => {
  beforeEach(() => jest.clearAllMocks());

  it('يرجع 400 لو الـ OTP غلط أو منتهي', async () => {
    User.findOne.mockResolvedValue(null);

    const req = mockReq({ email: 'test@test.com', password: 'newpass', otp: '000000' });
    const res = mockRes();

    await resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'كود التحقق غير صحيح أو منتهي الصلاحية' })
    );
  });

  it('يرجع 200 ويغيّر الباسورد لو الـ OTP صح', async () => {
    const mockUser = {
      password:               '',
      resetPasswordOtp:       '123456',
      resetPasswordOtpExpire: undefined,
      save:                   jest.fn().mockResolvedValue(true),
    };
    User.findOne.mockResolvedValue(mockUser);

    const req = mockReq({ email: 'test@test.com', password: 'newpassword', otp: '123456' });
    const res = mockRes();

    await resetPassword(req, res);

    expect(mockUser.password).toBe('newpassword');
    expect(mockUser.resetPasswordOtp).toBeUndefined();
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

// logout
describe('logout', () => {
  beforeEach(() => jest.clearAllMocks());

  it('يحذف الـ token ويرجع 200', async () => {
    const mockUser = {
      tokens: [{ token: 'valid_token' }, { token: 'other_token' }],
      save:   jest.fn().mockResolvedValue(true),
    };

    const req = {
      user:  mockUser,
      token: 'valid_token',
      body:  {},
      headers: {},
    };
    const res = mockRes();

    await logout(req, res);

    expect(mockUser.tokens).toHaveLength(1);
    expect(mockUser.tokens[0].token).toBe('other_token');
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});

// contactUs
describe('contactUs', () => {
  beforeEach(() => jest.clearAllMocks());

  it('يبعت إيميلين ويرجع 200', async () => {
    sendEmail.mockResolvedValue(true);

    const req = mockReq({ name: 'Ahmed', email: 'ahmed@test.com', message: 'مرحبا' });
    const res = mockRes();

    await contactUs(req, res);

    expect(sendEmail).toHaveBeenCalledTimes(2);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('يرجع 500 لو فشل إرسال الإيميل', async () => {
    sendEmail.mockRejectedValue(new Error('SMTP Error'));

    const req = mockReq({ name: 'Ahmed', email: 'ahmed@test.com', message: 'مرحبا' });
    const res = mockRes();

    await contactUs(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});