package org.unstoppable.montao.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;
import org.unstoppable.montao.entity.Channel;
import org.unstoppable.montao.entity.Community;
import org.unstoppable.montao.exception.ChannelFormException;
import org.unstoppable.montao.exception.CommunityNotFoundException;
import org.unstoppable.montao.model.ChannelCreationForm;
import org.unstoppable.montao.service.*;
import org.unstoppable.montao.validator.ChannelValidator;

import javax.validation.Valid;
import java.net.URI;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping(value = "/api/channel")
public class ChannelRestController {
    private final CommunityService communityService;
    private final ChannelService channelService;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public ChannelRestController(CommunityService communityService,
                                 ChannelService channelService,
                                 SimpMessagingTemplate messagingTemplate) {
        this.communityService = communityService;
        this.channelService = channelService;
        this.messagingTemplate = messagingTemplate;
    }

    @PostMapping(value = "/add", consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity addChannel(@Valid @RequestBody ChannelCreationForm channelForm,
                                     BindingResult result,
                                     UriComponentsBuilder uriComponentsBuilder) {
        new ChannelValidator(channelService).validate(channelForm, result);
        if (result.hasErrors()) {
            throw new ChannelFormException("Form validation failed");
        }
        Community community = communityService.getByTitle(channelForm.getCommunityTitle());
        if (community == null) {
            throw new CommunityNotFoundException("Community not found");
        }
        Channel channel = channelForm.createChannel(community);
        channelService.add(channel);
        messagingTemplate
                .convertAndSend("/topic/" + channel.getCommunity().getTitle() + "/newChannelNotification",
                channel);
        URI location = uriComponentsBuilder
                .path("/community/{communityTitle}/channels/{channelTitle}")
                .buildAndExpand(channel.getCommunity().getTitle(), channel.getTitle())
                .toUri();
        return ResponseEntity.created(location).build();
    }

    /**
     * Returns false if channel title already exist and true if not.
     *
     * @param channelTitle   Channel title.
     * @param communityTitle Community title.
     * @return String "true" or "false".
     */
    @PostMapping(value = "/check_title")
    public String checkTitle(String channelTitle, String communityTitle) {
        return channelService.checkTitle(channelTitle, communityTitle).toString();
    }

    @PostMapping(value = "/get_last_opened_channel", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity getLastOpenedChannel(@RequestParam(name = "communityTitle") String communityTitle,
                                               Principal principal) {
        if (principal == null) {
            // If principal is null, get default channel (general)
            Community community = communityService.getByTitle(communityTitle);
            if (community == null) {
                throw new CommunityNotFoundException("Community not found");
            }
            return ResponseEntity.ok(community.getChannels().get(0));
        }
        // Else get last opened channel
        // TODO: 30.09.2016 fix this branch
        Community community = communityService.getByTitle(communityTitle);
        if (community == null) {
            throw new CommunityNotFoundException("Community not found");
        }
        Channel channel = community.getChannels().get(0);
        return ResponseEntity.ok(channel);
    }

    @PostMapping(value = "/get_channels", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity getChannels(@RequestParam(name = "communityTitle") String communityTitle) {
        Community community = communityService.getByTitle(communityTitle);
        if (community == null) {
            throw new CommunityNotFoundException("Community not found");
        }
        List<Channel> channels = community.getChannels();
        if (channels.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(channels);
    }

    @PostMapping(value = "/get_channel", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public ResponseEntity getChannelByTitle(@RequestParam String communityTitle, @RequestParam String channelTitle) {
        Community community = communityService.getByTitle(communityTitle);
        if (community == null) {
            throw new CommunityNotFoundException("Community not found");
        }
        Channel channel = community.getChannels().stream()
                .filter(c -> c.getTitle().equals(channelTitle))
                .findFirst()
                .orElse(null);
        return ResponseEntity.ok(channel);
    }
}
