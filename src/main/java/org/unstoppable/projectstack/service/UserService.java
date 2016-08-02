package org.unstoppable.projectstack.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;
import org.unstoppable.projectstack.dao.CommunityDAO;
import org.unstoppable.projectstack.dao.UserDAO;
import org.unstoppable.projectstack.entity.Community;
import org.unstoppable.projectstack.entity.User;

import java.math.BigInteger;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserDAO userDAO;
    @Autowired
    private CommunityDAO communityDAO;

    /**
     * Used to add new user to db.
     *
     * @param user New user.
     */
    public void registerNewUser(User user) {
        userDAO.add(user);
    }

    /**
     * Returns all users from db.
     *
     * @return List of users.
     */
    public List<User> getAll() {
        return userDAO.getAll();
    }

    /**
     * Returns user from db.
     *
     * @param id User id.
     * @return User.
     */
    public User getById(BigInteger id) {
        return userDAO.getById(id);
    }

    /**
     * Removes user from db.
     *
     * @param user User.
     */
    public void delete(User user) {
        userDAO.delete(user);
    }

    /**
     * Find user by username.
     *
     * @param username Username.
     * @return User.
     */
    public User getByUsername(String username) {
        return userDAO.getByUsername(username);
    }

    public User getByToken(String token) {
        return userDAO.getByUUID(token);
    }

    /**
     * Returns false if user exist and true if not.
     *
     * @param username Username.
     * @return True or false.
     */
    public Boolean checkUsername(String username) {
        // check same username existence
        User user = userDAO.getByUsername(username);
        // check same community title existence
        Community community = communityDAO.getByTitle(username);
        return user == null && community == null;
    }

    /**
     * Returns false if user exist and true if not.
     *
     * @param email email.
     * @return True or false.
     */
    public Boolean checkEmail(String email) {
        User user = userDAO.getByEmail(email);
        return user == null;
    }

    public void update(User user) {
        userDAO.update(user);
    }

    public void sendConfirmRegistrationMessage(User user) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setTo(user.getEmail());
        simpleMailMessage.setSubject("Registration Confirmation");
        simpleMailMessage.setText("" +
                "<p>Thanks for signing up!<p>" +
                "<p>Please click the link below to activate your account:<p>" +
                "<a href=\"http://localhost:8080/registration/confirm?token=" + user.getUuid() + "\">Verify You Account<a>");
        JavaMailSender mailSender = new JavaMailSenderImpl();
        mailSender.send(simpleMailMessage);
    }
}
