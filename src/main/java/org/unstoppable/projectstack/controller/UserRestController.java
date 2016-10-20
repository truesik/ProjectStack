package org.unstoppable.projectstack.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import org.unstoppable.projectstack.entity.Community;
import org.unstoppable.projectstack.entity.Subscription;
import org.unstoppable.projectstack.entity.User;
import org.unstoppable.projectstack.model.UserRegistrationForm;
import org.unstoppable.projectstack.service.CommunityService;
import org.unstoppable.projectstack.service.SubscriptionService;
import org.unstoppable.projectstack.service.UserService;
import org.unstoppable.projectstack.validator.UserValidator;

import javax.validation.Valid;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping(value = "/api/user")
public class UserRestController {
    private final UserService userService;
    private final SubscriptionService subscriptionService;
    private final CommunityService communityService;

    @Autowired
    public UserRestController(UserService userService,
                              SubscriptionService subscriptionService,
                              CommunityService communityService) {
        this.userService = userService;
        this.subscriptionService = subscriptionService;
        this.communityService = communityService;
    }

    @RequestMapping(value = "/add", method = RequestMethod.POST)
    public ResponseEntity<Void> addUser(@Valid @RequestBody UserRegistrationForm userForm,
                                        BindingResult result,
                                        UriComponentsBuilder uriComponentsBuilder) {
        new UserValidator(userService).validate(userForm, result);
        if (result.hasErrors()) {
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        } else {
            User user = userForm.createUser();
            userService.registerNewUser(user);
            HttpHeaders headers = new HttpHeaders();
            URI location = uriComponentsBuilder.path("/{username}").buildAndExpand(user.getUsername()).toUri();
            headers.setLocation(location);
            return new ResponseEntity<>(headers, HttpStatus.CREATED);
        }
    }

    @RequestMapping(value = "/check_username", method = RequestMethod.POST)
    public String checkUsername(String username) {
        return userService.checkUsername(username).toString();
    }

    @RequestMapping(value = "/check_email", method = RequestMethod.POST)
    public String checkEmail(String email) {
        return userService.checkEmail(email).toString();
    }

    @PostMapping(value = "/get_subscribed_users", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Subscription>> getSubscribedUsers(@RequestParam(value = "communityTitle") String communityTitle) {
        Community community = communityService.getByTitle(communityTitle);
        List<Subscription> subscriptions = subscriptionService.getByCommunity(community);
        return new ResponseEntity<>(subscriptions, HttpStatus.OK);
    }
}